# Document 1: Real Estate Property Listing

## Domain: Real Estate
## Schema Complexity: 22 fields, shallow nesting

---

## Source Text

174 Crescent Ridge Drive, Asheville, NC 28801 — Listed by Blue Mountain Realty on February 12, 2026, at an asking price of $685,000. This single-family residence was originally built in 1997 and underwent a full kitchen and bathroom renovation in 2019. The property sits on a 0.43-acre lot and offers 2,340 square feet of living space across two stories. It has 4 bedrooms and 3 full bathrooms. The attached two-car garage was added during a 2012 expansion. Annual property taxes are $4,870 based on the 2025 Buncombe County assessment. The home is heated by a natural gas forced-air system and cooled by central air conditioning. HOA dues are $175 per month, covering road maintenance, snow removal, and access to the community pool. The listing agent is Diane Cowell, reachable at diane.cowell@bluemtnrealty.com or (828) 555-0193. The MLS number is BMR-2026-04417.

---

## Schema

```typescript
const PropertyListingSchema = z.object({
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
  }),
  mlsNumber: z.string(),
  askingPrice: z.number(),
  listingDate: z.string().describe("ISO 8601 format: YYYY-MM-DD"),
  listingBrokerage: z.string(),
  propertyType: z.enum(["single-family", "multi-family", "condo", "townhouse"]),
  yearBuilt: z.number(),
  lastRenovationYear: z.number(),
  lotSizeAcres: z.number(),
  livingAreaSqFt: z.number(),
  stories: z.number(),
  bedrooms: z.number(),
  bathrooms: z.number(),
  garageCapacity: z.number(),
  annualPropertyTax: z.number(),
  heatingSystem: z.enum(["natural-gas-forced-air", "electric-forced-air", "heat-pump", "radiant", "baseboard"]),
  coolingSystem: z.enum(["central-air", "window-units", "heat-pump", "evaporative", "none"]),
  hoaMonthlyDues: z.number(),
  listingAgent: z.object({
    name: z.string(),
    email: z.string(),
    phone: z.string().describe("Format: (XXX) XXX-XXXX"),
  }),
});
```

---

## Ground Truth

```json
{
  "address": {
    "street": "174 Crescent Ridge Drive",
    "city": "Asheville",
    "state": "NC",
    "zipCode": "28801"
  },
  "mlsNumber": "BMR-2026-04417",
  "askingPrice": 685000,
  "listingDate": "2026-02-12",
  "listingBrokerage": "Blue Mountain Realty",
  "propertyType": "single-family",
  "yearBuilt": 1997,
  "lastRenovationYear": 2019,
  "lotSizeAcres": 0.43,
  "livingAreaSqFt": 2340,
  "stories": 2,
  "bedrooms": 4,
  "bathrooms": 3,
  "garageCapacity": 2,
  "annualPropertyTax": 4870,
  "heatingSystem": "natural-gas-forced-air",
  "coolingSystem": "central-air",
  "hoaMonthlyDues": 175,
  "listingAgent": {
    "name": "Diane Cowell",
    "email": "diane.cowell@bluemtnrealty.com",
    "phone": "(828) 555-0193"
  }
}
```

---

## Field Count: 22 (including nested fields)
## Nesting Depth: 2 levels (address, listingAgent)
