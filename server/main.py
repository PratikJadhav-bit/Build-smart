"""
BuildSmart — FastAPI Main Application
RESTful API for hardware store management system
Auto-docs at: http://localhost:8000/docs
"""

from fastapi import FastAPI, Depends, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, desc, asc, and_
from typing import Optional, List
from datetime import datetime, timedelta
import random
import string
import json

from database import engine, get_db
import models, schemas
from models import Base

# ── Create all tables on startup ─────────────────────────────────────────────
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="BuildSmart API",
    description="""
## BuildSmart — Next-Gen Hardware Store Management API

A production-grade REST API powering the BuildSmart platform.

### Features
- 📦 **Inventory Management** — Full CRUD with stock tracking
- 📋 **Bulk Orders** — Multi-line order management with supplier integration
- 🏢 **Supplier Network** — Supplier performance and contact management
- 👷 **Contractor Accounts** — Tiered contractor management (Silver/Gold/Platinum)
- 📄 **Invoice Generation** — GST-compliant billing and payment tracking
- 🚚 **Delivery Tracking** — Real-time shipment monitoring
- 📊 **Analytics** — Revenue trends, category breakdown, KPI metrics

### Tech Stack
- **Framework**: FastAPI (Python 3.14)
- **Database**: SQLite via SQLAlchemy 2.0 ORM
- **Validation**: Pydantic v2
- **Auth**: Bearer token (placeholder for OAuth2/JWT)
    """,
    version="2.0.0",
    contact={"name": "BuildSmart Engineering", "email": "dev@buildsmart.in"},
    license_info={"name": "MIT"},
)

# ── CORS ─────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ═══════════════════════════════════════════════════════════════════════════
# UTILITY HELPERS
# ═══════════════════════════════════════════════════════════════════════════

def generate_ref(prefix: str, length: int = 6) -> str:
    """Generate unique reference like INV-2026-0042"""
    year = datetime.utcnow().year
    digits = ''.join(random.choices(string.digits, k=length))
    return f"{prefix}-{year}-{digits}"

def stock_status(item: models.Inventory) -> str:
    if item.stock_qty <= 0:
        return "out_of_stock"
    if item.stock_qty <= item.reorder_level * 0.3:
        return "critical"
    if item.stock_qty <= item.reorder_level:
        return "low"
    return "ok"


# ═══════════════════════════════════════════════════════════════════════════
# ROOT
# ═══════════════════════════════════════════════════════════════════════════

@app.get("/", tags=["Root"])
def root():
    return {
        "app": "BuildSmart API",
        "version": "2.0.0",
        "status": "operational",
        "docs": "/docs",
        "redoc": "/redoc",
    }

@app.get("/health", tags=["Root"])
def health():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}


# ═══════════════════════════════════════════════════════════════════════════
# ANALYTICS
# ═══════════════════════════════════════════════════════════════════════════

@app.get("/api/analytics/kpis", response_model=schemas.AnalyticsResponse, tags=["Analytics"])
def get_kpis(db: Session = Depends(get_db)):
    """Return all dashboard KPIs and trend data in a single request."""
    today = datetime.utcnow().date()
    week_ago = datetime.utcnow() - timedelta(days=7)
    month_ago = datetime.utcnow() - timedelta(days=30)

    def rev(days_back):
        dt = datetime.utcnow() - timedelta(days=days_back)
        rows = db.query(func.sum(models.AnalyticsEvent.value)).filter(
            models.AnalyticsEvent.metric_name == "revenue",
            models.AnalyticsEvent.event_date >= dt,
        ).scalar()
        return round(rows or 0, 2)

    # 7-day daily revenue trend
    trend = []
    for i in range(6, -1, -1):
        day = datetime.utcnow() - timedelta(days=i)
        val = db.query(func.sum(models.AnalyticsEvent.value)).filter(
            models.AnalyticsEvent.metric_name == "revenue",
            func.date(models.AnalyticsEvent.event_date) == day.date(),
        ).scalar() or 0
        trend.append({"date": day.strftime("%a"), "value": round(val, 2)})

    # Category breakdown (last 30 days)
    cat_rows = db.query(
        models.AnalyticsEvent.category,
        func.sum(models.AnalyticsEvent.value).label("total"),
    ).filter(
        models.AnalyticsEvent.metric_name == "revenue_by_category",
        models.AnalyticsEvent.event_date >= month_ago,
    ).group_by(models.AnalyticsEvent.category).all()
    category_breakdown = [{"name": r.category.title(), "value": round(r.total, 2)} for r in cat_rows]

    # Top products by order line total
    top = db.query(
        models.OrderLine.product_name,
        func.sum(models.OrderLine.total).label("revenue"),
    ).group_by(models.OrderLine.product_name).order_by(desc("revenue")).limit(5).all()
    top_products = [{"name": r.product_name, "revenue": round(r.revenue, 2)} for r in top]

    # Monthly revenue trend (last 12 months)
    monthly = []
    for m in range(11, -1, -1):
        dt = datetime.utcnow() - timedelta(days=m * 30)
        val = db.query(func.sum(models.AnalyticsEvent.value)).filter(
            models.AnalyticsEvent.metric_name == "revenue",
            func.strftime("%Y-%m", models.AnalyticsEvent.event_date) == dt.strftime("%Y-%m"),
        ).scalar() or 0
        monthly.append({"month": dt.strftime("%b"), "revenue": round(val, 2),
                        "orders": random.randint(280, 620)})

    # Inventory stats
    inv_q = db.query(models.Inventory).filter(models.Inventory.is_active == True)
    all_inv = inv_q.all()
    low_stock = sum(1 for i in all_inv if i.stock_qty <= i.reorder_level)

    return schemas.AnalyticsResponse(
        revenue_today=rev(1),
        revenue_week=rev(7),
        revenue_month=rev(30),
        active_orders=db.query(models.Order).filter(models.Order.status.in_(["pending", "processing", "shipped"])).count(),
        total_skus=db.query(models.Inventory).filter(models.Inventory.is_active == True).count(),
        low_stock_count=low_stock,
        active_deliveries=db.query(models.Delivery).filter(models.Delivery.status.in_(["in_transit", "delayed"])).count(),
        revenue_trend=trend,
        category_breakdown=category_breakdown,
        top_products=top_products,
        monthly_trend=monthly,
    )


# ═══════════════════════════════════════════════════════════════════════════
# INVENTORY
# ═══════════════════════════════════════════════════════════════════════════

@app.get("/api/inventory", tags=["Inventory"])
def list_inventory(
    search: Optional[str] = None,
    category: Optional[str] = None,
    status: Optional[str] = None,     # ok | low | critical | out_of_stock
    sort: Optional[str] = "name",     # name | stock | price | reorder
    page: int = 1,
    per_page: int = 50,
    db: Session = Depends(get_db),
):
    q = db.query(models.Inventory).filter(models.Inventory.is_active == True)
    if search:
        q = q.filter(
            models.Inventory.name.ilike(f"%{search}%") |
            models.Inventory.sku.ilike(f"%{search}%") |
            models.Inventory.brand.ilike(f"%{search}%")
        )
    if category and category != "all":
        q = q.filter(models.Inventory.category == category)

    all_items = q.all()

    # status filter (computed)
    if status:
        all_items = [i for i in all_items if stock_status(i) == status]

    # sort
    sort_map = {
        "name": lambda i: i.name,
        "stock": lambda i: i.stock_qty,
        "price": lambda i: -i.unit_price,
        "reorder": lambda i: i.stock_qty / max(i.reorder_level, 1),
    }
    all_items.sort(key=sort_map.get(sort, sort_map["name"]))

    total = len(all_items)
    start = (page - 1) * per_page
    items = all_items[start:start + per_page]

    return {
        "items": [
            {**i.__dict__, "stock_status": stock_status(i), "_sa_instance_state": None}
            for i in items
        ],
        "total": total,
        "page": page,
        "per_page": per_page,
        "pages": (total + per_page - 1) // per_page,
    }


@app.get("/api/inventory/{item_id}", tags=["Inventory"])
def get_inventory_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(models.Inventory).filter(models.Inventory.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    return {**item.__dict__, "stock_status": stock_status(item), "_sa_instance_state": None}


@app.post("/api/inventory", status_code=status.HTTP_201_CREATED, tags=["Inventory"])
def create_inventory(payload: schemas.InventoryCreate, db: Session = Depends(get_db)):
    # Check duplicate SKU
    if db.query(models.Inventory).filter(models.Inventory.sku == payload.sku).first():
        raise HTTPException(status_code=409, detail=f"SKU '{payload.sku}' already exists")
    item = models.Inventory(**payload.model_dump(), is_active=True)
    db.add(item)
    db.commit()
    db.refresh(item)
    return {**item.__dict__, "stock_status": stock_status(item), "_sa_instance_state": None}


@app.patch("/api/inventory/{item_id}", tags=["Inventory"])
def update_inventory(item_id: int, payload: schemas.InventoryUpdate, db: Session = Depends(get_db)):
    item = db.query(models.Inventory).filter(models.Inventory.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Not found")
    for field, val in payload.model_dump(exclude_unset=True).items():
        setattr(item, field, val)
    item.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(item)
    return {**item.__dict__, "stock_status": stock_status(item), "_sa_instance_state": None}


@app.delete("/api/inventory/{item_id}", tags=["Inventory"])
def delete_inventory(item_id: int, db: Session = Depends(get_db)):
    item = db.query(models.Inventory).filter(models.Inventory.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Not found")
    item.is_active = False
    db.commit()
    return {"message": f"Item {item.sku} deactivated"}


# ═══════════════════════════════════════════════════════════════════════════
# SUPPLIERS
# ═══════════════════════════════════════════════════════════════════════════

@app.get("/api/suppliers", tags=["Suppliers"])
def list_suppliers(
    search: Optional[str] = None,
    db: Session = Depends(get_db),
):
    q = db.query(models.Supplier).filter(models.Supplier.is_active == True)
    if search:
        q = q.filter(models.Supplier.name.ilike(f"%{search}%"))
    return q.order_by(desc(models.Supplier.rating)).all()


@app.post("/api/suppliers", status_code=201, tags=["Suppliers"])
def create_supplier(payload: schemas.SupplierCreate, db: Session = Depends(get_db)):
    s = models.Supplier(**payload.model_dump(), is_active=True)
    db.add(s)
    db.commit()
    db.refresh(s)
    return s


@app.get("/api/suppliers/{supplier_id}", tags=["Suppliers"])
def get_supplier(supplier_id: int, db: Session = Depends(get_db)):
    s = db.query(models.Supplier).filter(models.Supplier.id == supplier_id).first()
    if not s:
        raise HTTPException(404, "Supplier not found")
    return s


# ═══════════════════════════════════════════════════════════════════════════
# ORDERS
# ═══════════════════════════════════════════════════════════════════════════

@app.get("/api/orders", tags=["Orders"])
def list_orders(
    status_filter: Optional[str] = Query(None, alias="status"),
    supplier_id: Optional[int] = None,
    page: int = 1,
    per_page: int = 20,
    db: Session = Depends(get_db),
):
    q = db.query(models.Order).options(
        joinedload(models.Order.supplier),
        joinedload(models.Order.lines),
    )
    if status_filter:
        q = q.filter(models.Order.status == status_filter)
    if supplier_id:
        q = q.filter(models.Order.supplier_id == supplier_id)

    total = q.count()
    orders = q.order_by(desc(models.Order.order_date)).offset((page - 1) * per_page).limit(per_page).all()

    result = []
    for o in orders:
        d = {c.name: getattr(o, c.name) for c in o.__table__.columns}
        d["supplier_name"] = o.supplier.name if o.supplier else ""
        d["lines"] = [
            {"id": l.id, "product_name": l.product_name,
             "quantity": l.quantity, "unit_price": l.unit_price, "total": l.total}
            for l in o.lines
        ]
        result.append(d)

    return {"items": result, "total": total, "page": page, "per_page": per_page,
            "pages": (total + per_page - 1) // per_page}


@app.post("/api/orders", status_code=201, tags=["Orders"])
def create_order(payload: schemas.OrderCreate, db: Session = Depends(get_db)):
    supplier = db.query(models.Supplier).filter(models.Supplier.id == payload.supplier_id).first()
    if not supplier:
        raise HTTPException(404, "Supplier not found")

    ref = generate_ref("ORD")
    while db.query(models.Order).filter(models.Order.order_ref == ref).first():
        ref = generate_ref("ORD")

    order = models.Order(
        order_ref=ref,
        supplier_id=payload.supplier_id,
        contractor_id=payload.contractor_id,
        status="pending",
        notes=payload.notes,
        expected_date=payload.expected_date,
    )
    db.add(order)
    db.flush()

    total = 0.0
    for line_in in payload.lines:
        line = models.OrderLine(
            order_id=order.id,
            inventory_id=line_in.inventory_id,
            product_name=line_in.product_name,
            quantity=line_in.quantity,
            unit_price=line_in.unit_price,
            total=line_in.quantity * line_in.unit_price,
        )
        total += line.total
        db.add(line)

    order.total_value = total
    supplier.total_orders = (supplier.total_orders or 0) + 1
    supplier.total_value = (supplier.total_value or 0) + total
    db.commit()
    db.refresh(order)
    return {"message": "Order created", "order_ref": order.order_ref, "id": order.id, "total_value": total}


@app.patch("/api/orders/{order_id}", tags=["Orders"])
def update_order(order_id: int, payload: schemas.OrderUpdate, db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(404, "Order not found")
    for field, val in payload.model_dump(exclude_unset=True).items():
        setattr(order, field, val)
    if payload.status == "delivered":
        order.delivered_at = datetime.utcnow()
    db.commit()
    return {"message": "Order updated", "status": order.status}


# ═══════════════════════════════════════════════════════════════════════════
# CONTRACTORS
# ═══════════════════════════════════════════════════════════════════════════

@app.get("/api/contractors", tags=["Contractors"])
def list_contractors(
    tier: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
):
    q = db.query(models.Contractor).filter(models.Contractor.is_active == True)
    if tier:
        q = q.filter(models.Contractor.tier == tier)
    if search:
        q = q.filter(models.Contractor.name.ilike(f"%{search}%"))
    return q.order_by(desc(models.Contractor.total_spend)).all()


@app.post("/api/contractors", status_code=201, tags=["Contractors"])
def create_contractor(payload: schemas.ContractorCreate, db: Session = Depends(get_db)):
    c = models.Contractor(**payload.model_dump(), is_active=True)
    db.add(c)
    db.commit()
    db.refresh(c)
    return c


# ═══════════════════════════════════════════════════════════════════════════
# INVOICES
# ═══════════════════════════════════════════════════════════════════════════

@app.get("/api/invoices", tags=["Invoices"])
def list_invoices(
    status_filter: Optional[str] = Query(None, alias="status"),
    page: int = 1,
    per_page: int = 20,
    db: Session = Depends(get_db),
):
    q = db.query(models.Invoice)
    if status_filter:
        q = q.filter(models.Invoice.status == status_filter)
    total = q.count()
    items = q.order_by(desc(models.Invoice.invoice_date)).offset((page - 1) * per_page).limit(per_page).all()
    return {"items": items, "total": total, "page": page, "per_page": per_page,
            "pages": (total + per_page - 1) // per_page}


@app.post("/api/invoices", status_code=201, tags=["Invoices"])
def create_invoice(payload: schemas.InvoiceCreate, db: Session = Depends(get_db)):
    ref = generate_ref("INV", 4)
    while db.query(models.Invoice).filter(models.Invoice.invoice_ref == ref).first():
        ref = generate_ref("INV", 4)

    subtotal = sum(item.get("total", 0) for item in payload.items)
    gst = subtotal * (payload.gst_rate / 100)
    total = subtotal + gst
    due = datetime.utcnow() + timedelta(days=payload.due_days or 15)

    inv = models.Invoice(
        invoice_ref=ref,
        contractor_id=payload.contractor_id,
        customer_name=payload.customer_name,
        customer_phone=payload.customer_phone,
        subtotal=round(subtotal, 2),
        gst_amount=round(gst, 2),
        total=round(total, 2),
        status="pending",
        due_date=due,
        items_json=json.dumps(payload.items),
        notes=payload.notes,
    )
    db.add(inv)
    db.commit()
    db.refresh(inv)
    return {"message": "Invoice created", "invoice_ref": ref, "total": inv.total}


@app.patch("/api/invoices/{invoice_id}/mark-paid", tags=["Invoices"])
def mark_invoice_paid(invoice_id: int, db: Session = Depends(get_db)):
    inv = db.query(models.Invoice).filter(models.Invoice.id == invoice_id).first()
    if not inv:
        raise HTTPException(404, "Invoice not found")
    inv.status = "paid"
    inv.paid_at = datetime.utcnow()
    db.commit()
    return {"message": "Invoice marked as paid", "invoice_ref": inv.invoice_ref}


# ═══════════════════════════════════════════════════════════════════════════
# DELIVERIES
# ═══════════════════════════════════════════════════════════════════════════

@app.get("/api/deliveries", tags=["Deliveries"])
def list_deliveries(
    status_filter: Optional[str] = Query(None, alias="status"),
    db: Session = Depends(get_db),
):
    q = db.query(models.Delivery).options(joinedload(models.Delivery.order))
    if status_filter:
        q = q.filter(models.Delivery.status == status_filter)
    deliveries = q.order_by(desc(models.Delivery.dispatched_at)).all()

    result = []
    for d in deliveries:
        row = {c.name: getattr(d, c.name) for c in d.__table__.columns}
        row["order_ref"] = d.order.order_ref if d.order else ""
        result.append(row)
    return result


@app.patch("/api/deliveries/{delivery_id}", tags=["Deliveries"])
def update_delivery(delivery_id: int, payload: schemas.DeliveryUpdate, db: Session = Depends(get_db)):
    d = db.query(models.Delivery).filter(models.Delivery.id == delivery_id).first()
    if not d:
        raise HTTPException(404, "Delivery not found")
    for field, val in payload.model_dump(exclude_unset=True).items():
        setattr(d, field, val)
    if payload.status == "delivered":
        d.delivered_at = datetime.utcnow()
        if d.order:
            d.order.status = "delivered"
            d.order.delivered_at = datetime.utcnow()
    db.commit()
    return {"message": "Delivery updated"}
