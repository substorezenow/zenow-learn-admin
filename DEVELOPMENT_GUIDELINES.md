# 🏗️ Development Guidelines

## 📋 **Type System Standards**

### **1. ID Handling**
```typescript
// ✅ CORRECT: Always use string for database IDs
const categoryId: ID = "1114517564853649400";

// ❌ WRONG: Don't convert large IDs to numbers
const categoryId: number = parseInt("1114517564853649400"); // Loses precision!

// ✅ CORRECT: Use FlexibleID for form data
const formData: FieldFormData = {
  category_id: "1114517564853649400" // Can be string or number
};
```

### **2. Type Definitions**
- **Single Source of Truth**: All types defined in `src/types/` directory
- **No Duplication**: Never define the same interface in multiple files
- **Consistent Naming**: Use `CreateXRequest`, `UpdateXRequest`, `XFormData` patterns

### **3. Form Validation**
```typescript
// ✅ CORRECT: Use centralized validation schemas
import { ValidationSchemas } from '@/types/validation';

const { validateForm } = useFormValidation({
  initialData,
  validationSchema: ValidationSchemas.validateField
});
```

## 🔧 **Code Organization**

### **1. File Structure**
```
src/
├── types/
│   ├── common.ts          # Base types and utilities
│   ├── api.ts            # API request/response types
│   └── validation.ts     # Zod validation schemas
├── services/
│   └── adminApi.ts       # API service (no type definitions)
└── components/
    └── forms/            # Form components
```

### **2. Import Patterns**
```typescript
// ✅ CORRECT: Import from centralized types
import { CreateFieldRequest, FieldFormData } from '@/types/api';
import { ValidationSchemas } from '@/types/validation';
import { ID, toID } from '@/types/common';

// ❌ WRONG: Don't import types from service files
import { CreateFieldRequest } from '@/services/adminApi';
```

## 🚨 **Common Pitfalls to Avoid**

### **1. Number Precision Issues**
```typescript
// ❌ WRONG: This loses precision for large IDs
const id = Number("1114517564853649400"); // Becomes 1114517564853649400

// ✅ CORRECT: Keep as string
const id = "1114517564853649400";
```

### **2. Type Duplication**
```typescript
// ❌ WRONG: Defining same interface in multiple files
// In adminApi.ts
interface CreateFieldRequest { ... }

// In types/index.ts  
interface CreateFieldRequest { ... }

// ✅ CORRECT: Single definition in types/api.ts
export interface CreateFieldRequest { ... }
```

### **3. Partial Type Issues**
```typescript
// ❌ WRONG: Partial breaks union types
type UpdateRequest = Partial<CreateRequest>; // string | number becomes number | undefined

// ✅ CORRECT: Explicit optional types
type UpdateRequest = {
  field_id?: string | number;
  // ... other fields
};
```

### **4. Numeric Field Validation**
```typescript
// ❌ WRONG: HTML inputs always return strings, causing validation failures
sort_order: z.number().int("Must be integer").min(0, "Cannot be negative").optional(),

// ✅ CORRECT: Handle both string and number inputs
sort_order: z.union([
  z.number().int("Must be integer").min(0, "Cannot be negative"),
  z.string().regex(/^\d+$/, "Must be numeric").refine(val => parseInt(val) >= 0, "Cannot be negative")
]).optional(),

// ✅ CORRECT: For decimal fields (like price)
price: z.union([
  z.number().min(0, "Cannot be negative").max(9999.99, "Too high"),
  z.string().regex(/^\d+(\.\d{1,2})?$/, "Must be numeric").refine(val => {
    const num = parseFloat(val);
    return num >= 0 && num <= 9999.99;
  }, "Must be between 0 and 9999.99")
]).optional(),
```

**Why this matters:** HTML input fields with `type="number"` still return string values. Using `z.number()` alone will cause silent validation failures, making submit buttons unclickable.

## 🧪 **Testing Guidelines**

### **1. ID Precision Tests**
```typescript
describe('ID Precision', () => {
  it('should preserve large ID precision', () => {
    const largeId = "1114517564853649400";
    const formData = { category_id: largeId };
    
    expect(formData.category_id).toBe(largeId);
    expect(typeof formData.category_id).toBe('string');
  });
});
```

### **2. Type Safety Tests**
```typescript
describe('Type Safety', () => {
  it('should accept both string and number IDs', () => {
    const stringId: FlexibleID = "123";
    const numberId: FlexibleID = 123;
    
    expect(isValidID(stringId)).toBe(true);
    expect(isValidID(numberId)).toBe(true);
  });
});
```

## 📚 **Documentation Standards**

### **1. Type Documentation**
```typescript
/**
 * Field creation request
 * 
 * @param category_id - Can be string or number for form compatibility
 *                     Large IDs should be kept as strings to preserve precision
 */
export interface CreateFieldRequest {
  category_id: FlexibleID;
  // ...
}
```

### **2. Component Documentation**
```typescript
/**
 * FieldForm component
 * 
 * Handles field creation and editing with proper ID precision preservation.
 * Uses centralized validation schemas and type definitions.
 */
export default function FieldForm({ ... }) {
  // ...
}
```

## 🔄 **Migration Guide**

### **When Adding New Entities:**

1. **Define types** in `src/types/api.ts`
2. **Add validation** in `src/types/validation.ts`
3. **Update API service** in `src/services/adminApi.ts`
4. **Create form component** using centralized types
5. **Add tests** for ID precision and type safety

### **When Modifying Existing Entities:**

1. **Update types** in `src/types/api.ts` only
2. **Update validation** if needed
3. **Test thoroughly** for ID precision issues
4. **Update documentation** if behavior changes

## 🎯 **Key Principles**

1. **Single Source of Truth**: All types defined in one place
2. **ID Precision**: Always preserve large integer precision
3. **Type Safety**: Use TypeScript strictly, no `any` types
4. **Consistency**: Follow established patterns
5. **Documentation**: Document complex type decisions
6. **Testing**: Test ID precision and type safety

## 🚀 **Benefits**

- **No More Duplication**: Single type definitions
- **No More Precision Loss**: Proper ID handling
- **Better Maintainability**: Clear structure and patterns
- **Easier Onboarding**: Clear guidelines for new developers
- **Type Safety**: Catch issues at compile time
- **Consistency**: Uniform patterns across the codebase
