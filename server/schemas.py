"""
BuildSmart — Pydantic Schemas
Request/Response validation models for all API endpoints
"""

from __future__ import annotations
from typing import Optional, List, Any
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, ConfigDict


# ─────────────────────────────────────────────
# SUPPLIER SCHEMAS
# ─────────────────────────────────────────────
class SupplierBase(BaseModel):
    name: str
    category: Optional[str] = None
    contact_person: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    gstin: Optional[str] = None
    rating: Optional[float] = 4.0
    on_time_pct: Optional[float] = 90.0
    icon: Optional[str] = "🏢"

class SupplierCreate(SupplierBase):
    pass

class SupplierOut(SupplierBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    total_orders: int
    total_value: float
    is_active: bool
    created_at: datetime


# ─────────────────────────────────────────────
# INVENTORY SCHEMAS
# ─────────────────────────────────────────────
class InventoryBase(BaseModel):
    sku: str
    name: str
    category: str
    brand: Optional[str] = None
    unit: Optional[str] = "unit"
    stock_qty: float = 0
    max_stock: float = 0
    reorder_level: float = 10
    unit_price: float
    cost_price: Optional[float] = None
    location: Optional[str] = None
    supplier_id: Optional[int] = None
    icon: Optional[str] = "📦"
    gst_rate: Optional[float] = 18.0
    hsn_code: Optional[str] = None

class InventoryCreate(InventoryBase):
    pass

class InventoryUpdate(BaseModel):
    name: Optional[str] = None
    stock_qty: Optional[float] = None
    unit_price: Optional[float] = None
    reorder_level: Optional[float] = None
    location: Optional[str] = None

class InventoryOut(InventoryBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime
    stock_status: str = ""          # computed field populated in route

    @property
    def computed_status(self) -> str:
        if self.stock_qty <= 0:
            return "out_of_stock"
        if self.stock_qty <= self.reorder_level * 0.3:
            return "critical"
        if self.stock_qty <= self.reorder_level:
            return "low"
        return "ok"


# ─────────────────────────────────────────────
# ORDER LINE SCHEMAS
# ─────────────────────────────────────────────
class OrderLineIn(BaseModel):
    inventory_id: Optional[int] = None
    product_name: str
    quantity: float
    unit_price: float

class OrderLineOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    inventory_id: Optional[int]
    product_name: str
    quantity: float
    unit_price: float
    total: float


# ─────────────────────────────────────────────
# ORDER SCHEMAS
# ─────────────────────────────────────────────
class OrderCreate(BaseModel):
    supplier_id: int
    contractor_id: Optional[int] = None
    expected_date: Optional[datetime] = None
    notes: Optional[str] = None
    lines: List[OrderLineIn] = []

class OrderUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None
    expected_date: Optional[datetime] = None

class OrderOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    order_ref: str
    supplier_id: int
    contractor_id: Optional[int]
    status: str
    notes: Optional[str]
    total_value: float
    order_date: datetime
    expected_date: Optional[datetime]
    delivered_at: Optional[datetime]
    lines: List[OrderLineOut] = []
    supplier_name: str = ""     # populated in route


# ─────────────────────────────────────────────
# CONTRACTOR SCHEMAS
# ─────────────────────────────────────────────
class ContractorBase(BaseModel):
    initials: Optional[str] = None
    name: str
    company_type: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    gstin: Optional[str] = None
    address: Optional[str] = None
    tier: Optional[str] = "silver"
    credit_limit: Optional[float] = 50000
    since_year: Optional[int] = 2024

class ContractorCreate(ContractorBase):
    pass

class ContractorOut(ContractorBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    total_spend: float
    total_orders: int
    is_active: bool
    created_at: datetime


# ─────────────────────────────────────────────
# INVOICE SCHEMAS
# ─────────────────────────────────────────────
class InvoiceCreate(BaseModel):
    contractor_id: Optional[int] = None
    customer_name: str
    customer_phone: Optional[str] = None
    items: List[dict] = []
    gst_rate: Optional[float] = 18.0
    notes: Optional[str] = None
    due_days: Optional[int] = 15

class InvoiceUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None

class InvoiceOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    invoice_ref: str
    contractor_id: Optional[int]
    customer_name: str
    customer_phone: Optional[str]
    subtotal: float
    gst_amount: float
    total: float
    status: str
    invoice_date: datetime
    due_date: Optional[datetime]
    paid_at: Optional[datetime]
    items_json: str
    notes: Optional[str]


# ─────────────────────────────────────────────
# DELIVERY SCHEMAS
# ─────────────────────────────────────────────
class DeliveryCreate(BaseModel):
    order_id: int
    driver_name: str
    vehicle_no: Optional[str] = None
    destination: str
    eta_minutes: Optional[int] = None

class DeliveryUpdate(BaseModel):
    progress: Optional[float] = None
    status: Optional[str] = None
    map_x: Optional[float] = None
    map_y: Optional[float] = None
    eta_minutes: Optional[int] = None

class DeliveryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    delivery_ref: str
    order_id: int
    driver_name: str
    vehicle_no: Optional[str]
    destination: str
    progress: float
    status: str
    map_x: float
    map_y: float
    eta_minutes: Optional[int]
    dispatched_at: Optional[datetime]
    delivered_at: Optional[datetime]
    order_ref: str = ""


# ─────────────────────────────────────────────
# ANALYTICS SCHEMAS
# ─────────────────────────────────────────────
class AnalyticsResponse(BaseModel):
    revenue_today: float
    revenue_week: float
    revenue_month: float
    active_orders: int
    total_skus: int
    low_stock_count: int
    active_deliveries: int
    revenue_trend: List[dict]
    category_breakdown: List[dict]
    top_products: List[dict]
    monthly_trend: List[dict]


# ─────────────────────────────────────────────
# GENERIC
# ─────────────────────────────────────────────
class MessageResponse(BaseModel):
    message: str
    data: Optional[Any] = None

class PaginatedResponse(BaseModel):
    items: List[Any]
    total: int
    page: int
    per_page: int
    pages: int
