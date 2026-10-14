"""
BuildSmart — SQLAlchemy ORM Models
Defines all database tables with proper relationships
"""

import json
from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Boolean,
    DateTime, Text, ForeignKey, Enum
)
from sqlalchemy.orm import relationship
from database import Base


class Inventory(Base):
    __tablename__ = "inventory"

    id            = Column(Integer, primary_key=True, index=True)
    sku           = Column(String(20), unique=True, index=True, nullable=False)
    name          = Column(String(200), nullable=False, index=True)
    category      = Column(String(50), nullable=False, index=True)
    brand         = Column(String(100))
    unit          = Column(String(20), default="unit")
    stock_qty     = Column(Float, default=0)
    max_stock     = Column(Float, default=0)
    reorder_level = Column(Float, default=10)
    unit_price    = Column(Float, nullable=False)
    cost_price    = Column(Float)
    location      = Column(String(50))           # e.g. "Zone A-3"
    supplier_id   = Column(Integer, ForeignKey("suppliers.id"))
    icon          = Column(String(10), default="📦")
    is_active     = Column(Boolean, default=True)
    gst_rate      = Column(Float, default=18.0)
    hsn_code      = Column(String(20))
    created_at    = Column(DateTime, default=datetime.utcnow)
    updated_at    = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    supplier      = relationship("Supplier", back_populates="inventory_items")
    order_lines   = relationship("OrderLine", back_populates="inventory_item")


class Supplier(Base):
    __tablename__ = "suppliers"

    id              = Column(Integer, primary_key=True, index=True)
    name            = Column(String(200), nullable=False)
    category        = Column(String(100))
    contact_person  = Column(String(100))
    email           = Column(String(150))
    phone           = Column(String(20))
    address         = Column(Text)
    city            = Column(String(50))
    gstin           = Column(String(20))
    rating          = Column(Float, default=4.0)
    on_time_pct     = Column(Float, default=90.0)
    total_orders    = Column(Integer, default=0)
    total_value     = Column(Float, default=0.0)
    icon            = Column(String(10), default="🏢")
    is_active       = Column(Boolean, default=True)
    created_at      = Column(DateTime, default=datetime.utcnow)

    inventory_items = relationship("Inventory", back_populates="supplier")
    orders          = relationship("Order", back_populates="supplier")


class Order(Base):
    __tablename__ = "orders"

    id            = Column(Integer, primary_key=True, index=True)
    order_ref     = Column(String(30), unique=True, index=True)
    supplier_id   = Column(Integer, ForeignKey("suppliers.id"))
    contractor_id = Column(Integer, ForeignKey("contractors.id"), nullable=True)
    status        = Column(
        Enum("pending", "processing", "shipped", "delivered", "cancelled"),
        default="pending"
    )
    notes         = Column(Text)
    total_value   = Column(Float, default=0.0)
    order_date    = Column(DateTime, default=datetime.utcnow)
    expected_date = Column(DateTime)
    delivered_at  = Column(DateTime)
    created_at    = Column(DateTime, default=datetime.utcnow)

    supplier    = relationship("Supplier", back_populates="orders")
    contractor  = relationship("Contractor", back_populates="orders")
    lines       = relationship("OrderLine", back_populates="order", cascade="all, delete-orphan")
    delivery    = relationship("Delivery", back_populates="order", uselist=False)


class OrderLine(Base):
    __tablename__ = "order_lines"

    id           = Column(Integer, primary_key=True)
    order_id     = Column(Integer, ForeignKey("orders.id"))
    inventory_id = Column(Integer, ForeignKey("inventory.id"))
    product_name = Column(String(200))   # denormalized for history
    quantity     = Column(Float, nullable=False)
    unit_price   = Column(Float, nullable=False)
    total        = Column(Float, nullable=False)

    order          = relationship("Order", back_populates="lines")
    inventory_item = relationship("Inventory", back_populates="order_lines")


class Contractor(Base):
    __tablename__ = "contractors"

    id           = Column(Integer, primary_key=True, index=True)
    initials     = Column(String(5))
    name         = Column(String(200), nullable=False)
    company_type = Column(String(100))
    phone        = Column(String(20))
    email        = Column(String(150))
    gstin        = Column(String(20))
    address      = Column(Text)
    tier         = Column(Enum("silver", "gold", "platinum"), default="silver")
    credit_limit = Column(Float, default=50000)
    total_spend  = Column(Float, default=0)
    total_orders = Column(Integer, default=0)
    since_year   = Column(Integer, default=2024)
    is_active    = Column(Boolean, default=True)
    created_at   = Column(DateTime, default=datetime.utcnow)

    orders   = relationship("Order", back_populates="contractor")
    invoices = relationship("Invoice", back_populates="contractor")


class Invoice(Base):
    __tablename__ = "invoices"

    id            = Column(Integer, primary_key=True, index=True)
    invoice_ref   = Column(String(30), unique=True, index=True)
    contractor_id = Column(Integer, ForeignKey("contractors.id"), nullable=True)
    customer_name = Column(String(200))
    customer_phone= Column(String(20))
    subtotal      = Column(Float, default=0)
    gst_amount    = Column(Float, default=0)
    total         = Column(Float, default=0)
    status        = Column(
        Enum("pending", "paid", "overdue", "cancelled"),
        default="pending"
    )
    invoice_date  = Column(DateTime, default=datetime.utcnow)
    due_date      = Column(DateTime)
    paid_at       = Column(DateTime)
    items_json    = Column(Text, default="[]")    # JSON array of line items
    notes         = Column(Text)

    contractor = relationship("Contractor", back_populates="invoices")

    @property
    def items(self):
        return json.loads(self.items_json or "[]")

    @items.setter
    def items(self, value):
        self.items_json = json.dumps(value)


class Delivery(Base):
    __tablename__ = "deliveries"

    id          = Column(Integer, primary_key=True, index=True)
    delivery_ref= Column(String(30), unique=True, index=True)
    order_id    = Column(Integer, ForeignKey("orders.id"))
    driver_name = Column(String(100))
    vehicle_no  = Column(String(20))
    destination = Column(String(300))
    progress    = Column(Float, default=0)   # 0–100
    status      = Column(
        Enum("preparing", "in_transit", "delayed", "delivered", "returned"),
        default="preparing"
    )
    map_x       = Column(Float, default=50)  # % position on map
    map_y       = Column(Float, default=50)
    eta_minutes = Column(Integer)
    dispatched_at= Column(DateTime)
    delivered_at = Column(DateTime)
    created_at   = Column(DateTime, default=datetime.utcnow)

    order = relationship("Order", back_populates="delivery")


class AnalyticsEvent(Base):
    __tablename__ = "analytics_events"

    id          = Column(Integer, primary_key=True)
    event_date  = Column(DateTime, nullable=False, index=True)
    metric_name = Column(String(50), index=True)   # "revenue", "orders", etc.
    value       = Column(Float)
    category    = Column(String(50))
    created_at  = Column(DateTime, default=datetime.utcnow)
