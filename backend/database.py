from datetime import datetime, timezone

def utcnow():
    return datetime.now(timezone.utc)
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime, ForeignKey
)
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import declarative_base, relationship, sessionmaker

DATABASE_URL = "sqlite+aiosqlite:///./aibok.db"

engine = create_async_engine(DATABASE_URL, echo=False)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()


class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    org_number = Column(String, default="")
    vat_number = Column(String, default="")
    address = Column(String, default="")
    zip_code = Column(String, default="")
    city = Column(String, default="")
    country = Column(String, default="Sverige")
    email = Column(String, default="")
    phone = Column(String, default="")
    bankgiro = Column(String, default="")
    plusgiro = Column(String, default="")
    payment_terms = Column(Integer, default=30)  # days
    notes = Column(String, default="")
    created_at = Column(DateTime, default=utcnow)


class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)
    supplier = Column(String, nullable=False)
    invoice_date = Column(String)
    due_date = Column(String)
    invoice_number = Column(String)
    total_amount = Column(Float, default=0.0)
    vat_amount = Column(Float, default=0.0)
    currency = Column(String, default="SEK")
    message = Column(String, default="")
    is_credit = Column(Boolean, default=False)
    skip_payment = Column(Boolean, default=False)
    booked_at = Column(DateTime, default=utcnow)
    pdf_filename = Column(String, nullable=True)

    lines = relationship("AccountingLine", back_populates="invoice", cascade="all, delete-orphan")


class AccountingLine(Base):
    __tablename__ = "accounting_lines"

    id = Column(Integer, primary_key=True, index=True)
    invoice_id = Column(Integer, ForeignKey("invoices.id"), nullable=False)
    account = Column(String, nullable=False)
    vat_code = Column(String, default="")
    net_amount = Column(Float, default=0.0)

    invoice = relationship("Invoice", back_populates="lines")


async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
