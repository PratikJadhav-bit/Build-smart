"""
BuildSmart — Database Seeder
Seeds the SQLite database with rich, realistic sample data
Run: py seed.py
"""

import random
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from database import engine, SessionLocal, Base
import models


def seed_all():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(models.Supplier).count() > 0:
            print("Database already seeded. Skipping.")
            return
        print("Seeding database...")
        suppliers = seed_suppliers(db)
        inventory = seed_inventory(db, suppliers)
        contractors = seed_contractors(db)
        orders = seed_orders(db, suppliers, contractors, inventory)
        seed_invoices(db, contractors)
        seed_deliveries(db, orders)
        seed_analytics(db)
        db.commit()
        print("[OK] Database seeded successfully!")
    except Exception as e:
        db.rollback()
        print(f"[ERROR] Seeding failed: {e}")
        raise
    finally:
        db.close()


def seed_suppliers(db: Session):
    data = [
        dict(name="BuildMart Pro Pvt Ltd", category="Cement & Aggregates",
             contact_person="Arun Sharma", email="arun@buildmartpro.in",
             phone="+91 98400 12345", city="Bengaluru",
             gstin="29AABCB1234F1Z5", rating=4.8, on_time_pct=96,
             total_orders=142, total_value=2480000, icon="🏢"),
        dict(name="SteelForge Industries Ltd", category="Steel & Metals",
             contact_person="Vikram Nair", email="vikram@steelforge.in",
             phone="+91 98401 23456", city="Mumbai",
             gstin="27AAEFS5678G1Z2", rating=4.6, on_time_pct=92,
             total_orders=87, total_value=6120000, icon="⚙"),
        dict(name="PowerTool Inc.", category="Tools & Equipment",
             contact_person="Ramesh Gupta", email="ramesh@powertool.in",
             phone="+91 98402 34567", city="Pune",
             gstin="27AABPT9012H1Z8", rating=4.4, on_time_pct=88,
             total_orders=53, total_value=1240000, icon="🔧"),
        dict(name="ElectroPro Systems", category="Electrical",
             contact_person="Kavitha M.", email="kavitha@electropro.in",
             phone="+91 98403 45678", city="Chennai",
             gstin="33AACEP3456I1Z4", rating=4.7, on_time_pct=94,
             total_orders=98, total_value=1860000, icon="⚡"),
        dict(name="PlumbEx Solutions", category="Plumbing & Sanitary",
             contact_person="Suresh D.", email="suresh@plumbex.in",
             phone="+91 98404 56789", city="Hyderabad",
             gstin="36AABPS7890J1Z1", rating=4.2, on_time_pct=85,
             total_orders=61, total_value=890000, icon="🔩"),
        dict(name="PaintWorld Coatings", category="Paints & Coatings",
             contact_person="Priya K.", email="priya@paintworld.in",
             phone="+91 98405 67890", city="Delhi",
             gstin="07AABPW2345K1Z7", rating=4.5, on_time_pct=91,
             total_orders=44, total_value=1120000, icon="🎨"),
        dict(name="TileZone Ceramics", category="Tiles & Flooring",
             contact_person="Rajiv M.", email="rajiv@tilezone.in",
             phone="+91 98406 78901", city="Morbi",
             gstin="24AABTZ6789L1Z3", rating=4.3, on_time_pct=89,
             total_orders=38, total_value=970000, icon="⬜"),
    ]
    suppliers = []
    for d in data:
        s = models.Supplier(**d, is_active=True)
        db.add(s)
        suppliers.append(s)
    db.flush()
    return suppliers


def seed_inventory(db: Session, suppliers):
    sup = {s.name: s for s in suppliers}
    items = [
        dict(sku="SKU-CEM-001", name="Portland Cement 50kg (OPC 53 Grade)", category="cement",
             brand="UltraTech", unit="bag", stock_qty=420, max_stock=600,
             reorder_level=80, unit_price=420, cost_price=380,
             location="Zone A-1", supplier_id=sup["BuildMart Pro Pvt Ltd"].id,
             icon="🧱", gst_rate=28.0, hsn_code="2523"),
        dict(sku="SKU-CEM-002", name="Fly Ash Cement 50kg (PSC Grade)", category="cement",
             brand="Birla", unit="bag", stock_qty=280, max_stock=500,
             reorder_level=60, unit_price=390, cost_price=350,
             location="Zone A-2", supplier_id=sup["BuildMart Pro Pvt Ltd"].id,
             icon="🧱", gst_rate=28.0, hsn_code="2523"),
        dict(sku="SKU-STL-001", name="TMT Steel Bar 12mm Fe-500D", category="steel",
             brand="TATA Steel", unit="rod", stock_qty=38, max_stock=500,
             reorder_level=60, unit_price=6800, cost_price=6200,
             location="Zone B-1", supplier_id=sup["SteelForge Industries Ltd"].id,
             icon="⚙", gst_rate=18.0, hsn_code="7214"),
        dict(sku="SKU-STL-002", name="MS Angle 50×50×6mm 6m", category="steel",
             brand="TATA Steel", unit="piece", stock_qty=62, max_stock=150,
             reorder_level=20, unit_price=1850, cost_price=1680,
             location="Zone B-2", supplier_id=sup["SteelForge Industries Ltd"].id,
             icon="🏗", gst_rate=18.0, hsn_code="7216"),
        dict(sku="SKU-TLZ-001", name="Rotary Hammer Drill 26mm SDS", category="tools",
             brand="Bosch", unit="unit", stock_qty=12, max_stock=80,
             reorder_level=15, unit_price=12500, cost_price=10800,
             location="Zone C-1", supplier_id=sup["PowerTool Inc."].id,
             icon="🔧", gst_rate=18.0, hsn_code="8467"),
        dict(sku="SKU-TLZ-002", name="Angle Grinder 7 inch 2000W", category="tools",
             brand="Makita", unit="unit", stock_qty=24, max_stock=60,
             reorder_level=10, unit_price=4200, cost_price=3600,
             location="Zone C-2", supplier_id=sup["PowerTool Inc."].id,
             icon="🔨", gst_rate=18.0, hsn_code="8467"),
        dict(sku="SKU-ELE-001", name="LED High Bay Light 100W IP65", category="electrical",
             brand="Havells", unit="unit", stock_qty=7, max_stock=100,
             reorder_level=20, unit_price=2800, cost_price=2400,
             location="Zone D-1", supplier_id=sup["ElectroPro Systems"].id,
             icon="💡", gst_rate=18.0, hsn_code="9405"),
        dict(sku="SKU-ELE-002", name="Copper Wire 2.5mm² FR 90m Coil", category="electrical",
             brand="KEI Industries", unit="coil", stock_qty=55, max_stock=150,
             reorder_level=25, unit_price=2100, cost_price=1850,
             location="Zone D-2", supplier_id=sup["ElectroPro Systems"].id,
             icon="⚡", gst_rate=18.0, hsn_code="8544"),
        dict(sku="SKU-ELE-003", name="MCB 32A DP (Double Pole) C-Curve", category="electrical",
             brand="Schneider", unit="unit", stock_qty=180, max_stock=400,
             reorder_level=50, unit_price=680, cost_price=580,
             location="Zone D-3", supplier_id=sup["ElectroPro Systems"].id,
             icon="⚡", gst_rate=18.0, hsn_code="8536"),
        dict(sku="SKU-PLM-001", name="CPVC Pipe 1 inch Sch-80 3m", category="plumbing",
             brand="Astral", unit="piece", stock_qty=280, max_stock=400,
             reorder_level=50, unit_price=320, cost_price=270,
             location="Zone E-1", supplier_id=sup["PlumbEx Solutions"].id,
             icon="🔩", gst_rate=18.0, hsn_code="3917"),
        dict(sku="SKU-PLM-002", name="GI Pipe 1 inch IS:1239 6m", category="plumbing",
             brand="APL Apollo", unit="piece", stock_qty=3, max_stock=120,
             reorder_level=20, unit_price=1480, cost_price=1280,
             location="Zone E-2", supplier_id=sup["PlumbEx Solutions"].id,
             icon="🔩", gst_rate=18.0, hsn_code="7306"),
        dict(sku="SKU-PNT-001", name="Exterior Emulsion 20L Weather Guard", category="paint",
             brand="Asian Paints", unit="bucket", stock_qty=95, max_stock=200,
             reorder_level=30, unit_price=3800, cost_price=3200,
             location="Zone F-1", supplier_id=sup["PaintWorld Coatings"].id,
             icon="🎨", gst_rate=18.0, hsn_code="3209"),
        dict(sku="SKU-TLS-001", name="Vitrified Floor Tile 600×600mm Matt", category="tiles",
             brand="Kajaria", unit="box", stock_qty=340, max_stock=500,
             reorder_level=60, unit_price=1800, cost_price=1500,
             location="Zone F-2", supplier_id=sup["TileZone Ceramics"].id,
             icon="⬜", gst_rate=18.0, hsn_code="6908"),
        dict(sku="SKU-SND-001", name="M-Sand Fine Grade 1 Metric Ton", category="cement",
             brand="LocalMine", unit="ton", stock_qty=180, max_stock=300,
             reorder_level=40, unit_price=1800, cost_price=1600,
             location="Zone A-3", supplier_id=sup["BuildMart Pro Pvt Ltd"].id,
             icon="⬛", gst_rate=5.0, hsn_code="2505"),
    ]
    result = []
    for d in items:
        item = models.Inventory(**d, is_active=True)
        db.add(item)
        result.append(item)
    db.flush()
    return result


def seed_contractors(db: Session):
    data = [
        dict(initials="RK", name="Rajesh Kumar Builders", company_type="General Contractor",
             phone="+91 98410 11111", email="rajesh@rkbuilders.in",
             gstin="29AAARK1234M1Z9", tier="platinum",
             credit_limit=500000, total_spend=4820000, total_orders=284, since_year=2021),
        dict(initials="MS", name="Mahesh Singh Infra", company_type="Civil Engineer",
             phone="+91 98411 22222", email="ms@msinfra.in",
             gstin="29AAAMS5678N1Z6", tier="gold",
             credit_limit=200000, total_spend=2260000, total_orders=156, since_year=2022),
        dict(initials="AP", name="Amit Patel Constructions", company_type="Structural Contractor",
             phone="+91 98412 33333", email="amit@apconstructions.in",
             gstin="29AAAAP9012O1Z3", tier="gold",
             credit_limit=150000, total_spend=1580000, total_orders=98, since_year=2023),
        dict(initials="SD", name="Sunita Devi Interiors", company_type="Interior Designer",
             phone="+91 98413 44444", email="sunita@sdiinteriors.in",
             gstin="29AAAS3456P1Z0", tier="silver",
             credit_limit=75000, total_spend=640000, total_orders=42, since_year=2024),
        dict(initials="VR", name="Venkat Raju Electricals", company_type="Electrical Contractor",
             phone="+91 98414 55555", email="venkat@vrelectricals.in",
             gstin="29AAAVR7890Q1Z7", tier="silver",
             credit_limit=100000, total_spend=920000, total_orders=67, since_year=2023),
        dict(initials="NK", name="Neeraj Kapoor Projects", company_type="Plumbing Specialist",
             phone="+91 98415 66666", email="neeraj@nkprojects.in",
             gstin="29AAANK2345R1Z4", tier="gold",
             credit_limit=250000, total_spend=1730000, total_orders=119, since_year=2022),
    ]
    result = []
    for d in data:
        c = models.Contractor(**d, is_active=True)
        db.add(c)
        result.append(c)
    db.flush()
    return result


def seed_orders(db, suppliers, contractors, inventory):
    statuses = ["pending", "processing", "shipped", "delivered", "cancelled"]
    orders = []
    for i, (sup, status) in enumerate([
        (suppliers[0], "shipped"),
        (suppliers[1], "processing"),
        (suppliers[2], "pending"),
        (suppliers[3], "delivered"),
        (suppliers[4], "pending"),
        (suppliers[5], "delivered"),
        (suppliers[6], "processing"),
        (suppliers[0], "shipped"),
        (suppliers[1], "delivered"),
        (suppliers[2], "processing"),
    ]):
        order_ref = f"ORD-2026-{str(i+1).zfill(3)}"
        order_date = datetime.utcnow() - timedelta(days=random.randint(1, 20))
        expected = order_date + timedelta(days=random.randint(5, 14))
        o = models.Order(
            order_ref=order_ref,
            supplier_id=sup.id,
            contractor_id=contractors[i % len(contractors)].id if i % 3 != 0 else None,
            status=status,
            notes="Standard delivery — handle with care",
            order_date=order_date,
            expected_date=expected,
            delivered_at=expected if status == "delivered" else None,
        )
        db.add(o)
        db.flush()

        # 2-4 line items per order
        total = 0.0
        for inv in random.sample(inventory, min(random.randint(2, 4), len(inventory))):
            qty = random.randint(20, 200)
            line = models.OrderLine(
                order_id=o.id,
                inventory_id=inv.id,
                product_name=inv.name,
                quantity=qty,
                unit_price=inv.unit_price,
                total=qty * inv.unit_price,
            )
            total += line.total
            db.add(line)
        o.total_value = total
        orders.append(o)
    db.flush()
    return orders


def seed_invoices(db, contractors):
    import json
    for i, contr in enumerate(contractors):
        invoice_ref = f"INV-2026-{str(i+40).zfill(4)}"
        subtotal = random.uniform(30000, 250000)
        gst = subtotal * 0.18
        total = subtotal + gst
        statuses = ["paid", "pending", "paid", "overdue", "paid", "pending"]
        inv_date = datetime.utcnow() - timedelta(days=random.randint(1, 30))
        due = inv_date + timedelta(days=15)
        items_data = [
            {"product": "Portland Cement 50kg", "qty": random.randint(50, 200), "price": 420, "total": 420 * random.randint(50, 200)},
            {"product": "TMT Steel Bar 12mm", "qty": random.randint(10, 50), "price": 6800, "total": 6800 * random.randint(10, 50)},
        ]
        inv = models.Invoice(
            invoice_ref=invoice_ref,
            contractor_id=contr.id,
            customer_name=contr.name,
            customer_phone=contr.phone,
            subtotal=round(subtotal, 2),
            gst_amount=round(gst, 2),
            total=round(total, 2),
            status=statuses[i % len(statuses)],
            invoice_date=inv_date,
            due_date=due,
            paid_at=due if statuses[i % len(statuses)] == "paid" else None,
            items_json=json.dumps(items_data),
        )
        db.add(inv)
    db.flush()


def seed_deliveries(db, orders):
    active = [o for o in orders if o.status in ("shipped", "processing")]
    map_positions = [
        (62, 38), (35, 58), (78, 25), (22, 70), (55, 72),
    ]
    statuses = ["in_transit", "in_transit", "in_transit", "delayed", "in_transit"]
    for i, order in enumerate(active[:5]):
        ref = f"DEL-{str(i+1).zfill(3)}"
        x, y = map_positions[i]
        d = models.Delivery(
            delivery_ref=ref,
            order_id=order.id,
            driver_name=["Suresh B.", "Kiran M.", "Ramu S.", "Priya K.", "Anil T."][i],
            vehicle_no=f"KA-{random.randint(10,99)}-MX-{random.randint(1000,9999)}",
            destination=["Site A – Koramangala", "Site B – Whitefield",
                         "Site C – Indiranagar", "Site D – HSR Layout",
                         "Site E – Electronic City"][i],
            progress=random.uniform(20, 90),
            status=statuses[i],
            map_x=x,
            map_y=y,
            eta_minutes=random.randint(30, 360),
            dispatched_at=datetime.utcnow() - timedelta(hours=random.randint(1, 5)),
        )
        db.add(d)
    db.flush()


def seed_analytics(db):
    metrics = ["revenue", "orders", "new_customers"]
    categories = ["cement", "steel", "tools", "electrical", "plumbing", "paint"]
    # 90 days of daily data
    for day_offset in range(90):
        event_date = datetime.utcnow() - timedelta(days=90 - day_offset)
        for metric in metrics:
            if metric == "revenue":
                val = random.uniform(150000, 400000)
            elif metric == "orders":
                val = random.randint(15, 65)
            else:
                val = random.randint(1, 10)
            db.add(models.AnalyticsEvent(
                event_date=event_date,
                metric_name=metric,
                value=val,
                category="all",
            ))
        # category breakdown
        for cat in categories:
            db.add(models.AnalyticsEvent(
                event_date=event_date,
                metric_name="revenue_by_category",
                value=random.uniform(10000, 100000),
                category=cat,
            ))
    db.flush()


if __name__ == "__main__":
    seed_all()
