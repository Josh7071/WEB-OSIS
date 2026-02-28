# OSIS Manager - Best Practices & Development Guidelines

Best practices untuk development, maintenance, dan operations.

## 🎯 Frontend Development

### Component Structure

**Accepted File Structure:**
```
components/
├── ui/
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   └── [other base components]
├── layout/
│   ├── Sidebar.tsx
│   ├── PageHeader.tsx
│   └── DashboardLayout.tsx
└── feature/
    ├── KanbanBoard.tsx
    ├── EventCalendar.tsx
    └── [feature components]
```

**Component Template:**
```tsx
'use client';

import React from 'react';
import clsx from 'clsx';

interface ComponentProps {
  title: string;
  variant?: 'default' | 'outlined';
  disabled?: boolean;
}

export const MyComponent: React.FC<ComponentProps> = ({
  title,
  variant = 'default',
  disabled = false
}) => {
  return (
    <div className={clsx(
      'p-4 rounded-lg',
      variant === 'default' && 'bg-white shadow-md',
      variant === 'outlined' && 'border border-gray-300',
      disabled && 'opacity-50 cursor-not-allowed'
    )}>
      {title}
    </div>
  );
};
```

### State Management

**Use Zustand for global state:**
```tsx
// ✓ GOOD
import { useAuthStore } from '@/lib/store';

export const Dashboard = () => {
  const { user, isAuthenticated } = useAuthStore();
  // ...
};
```

**Use React state for local state:**
```tsx
// ✓ GOOD
const [isOpen, setIsOpen] = useState(false);

// ✗ AVOID
const store = useAuthStore();
// Using global store for component-scoped state
```

**Avoid prop drilling:**
```tsx
// ✓ GOOD - Use context or custom hook
const user = useAuth();

// ✗ AVOID - Passing through many levels
<Component user={user} />
  <ChildComponent user={user} />
    <GrandchildComponent user={user} />
```

### Styling

**Use Tailwind classes:**
```tsx
// ✓ GOOD
<div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg">
  Content
</div>

// ✗ AVOID
<div style={{"padding":"16px","background":"white","borderRadius":"8px"}}>
  Content
</div>
```

**Keep consistent spacing:**
```tsx
// ✓ GOOD - Consistent with design system
<div className="p-4 mb-6"> {/* md: 16px, mb: 24px */}
  
// ✗ AVOID - Random spacing
<div className="p-3 mb-5">
```

**Use clsx for conditional classes:**
```tsx
// ✓ GOOD
<div className={clsx(
  'p-4 rounded-lg',
  isActive && 'bg-blue-500 text-white',
  disabled && 'opacity-50'
)}>

// ✗ AVOID
<div className={'p-4 rounded-lg ' + (isActive ? 'bg-blue-500 text-white' : '') + (disabled ? 'opacity-50' : '')}>
```

### Forms

**Type safe form handling:**
```tsx
// ✓ GOOD
interface FormData {
  title: string;
  deadline: Date;
  priority: 'low' | 'medium' | 'high';
}

const [formData, setFormData] = useState<FormData>({
  title: '',
  deadline: new Date(),
  priority: 'medium'
});

// ✗ AVOID
const [formData, setFormData] = useState({});
```

**Validate on submit:**
```tsx
// ✓ GOOD
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!formData.title.trim()) {
    setError('Title is required');
    return;
  }
  
  // Submit...
};

// ✗ AVOID
const handleSubmit = (e: React.FormEvent) => {
  // Just submit without validation
};
```

### Performance

**Use React.memo for expensive components:**
```tsx
// ✓ GOOD
export const TaskCard = React.memo(({ task, onDelete }: TaskCardProps) => (
  <div>{task.title}</div>
));

// ✗ AVOID - Rerenders on every parent update
export const TaskCard = ({ task, onDelete }: TaskCardProps) => (
  <div>{task.title}</div>
);
```

**Use useCallback for event handlers:**
```tsx
// ✓ GOOD
const handleDelete = useCallback((id: string) => {
  // Delete logic
}, []);

// ✗ AVOID - New function created on every render
const handleDelete = (id: string) => {
  // Delete logic
};
```

**Use useMemo for expensive calculations:**
```tsx
// ✓ GOOD
const filteredTasks = useMemo(() => {
  return tasks.filter(t => t.status === filter);
}, [tasks, filter]);

// ✗ AVOID - Calculation runs on every render
const filteredTasks = tasks.filter(t => t.status === filter);
```

---

## 🔧 Backend Development

### API Response Format

**Always use consistent response format:**
```javascript
// ✓ GOOD
{
  success: true,
  message: "Data retrieved successfully",
  data: { /* actual data */ }
}

// ✗ AVOID
{ /* raw data */ }
{ error: "Something went wrong" }
{ message: "ok", content: { /* data */ } }
```

**Error responses:**
```javascript
// ✓ GOOD
{
  success: false,
  message: "User not found",
  error: "NOT_FOUND",
  statusCode: 404
}

// ✗ AVOID
{ error: "something" }
{ message: "User not found" }
```

### Middleware

**Use middleware for cross-cutting concerns:**
```javascript
// ✓ GOOD
app.use(authMiddleware);  // All routes need auth
app.use(errorHandler);     // All routes use error handler

// ✗ AVOID
// Checking auth in every route
app.get('/events', (req, res) => {
  if (!req.token) return res.status(401).json({error: 'Unauthorized'});
  // ... rest of logic
});
```

### Error Handling

**Use try-catch consistently:**
```javascript
// ✓ GOOD
router.get('/events', async (req, res) => {
  try {
    const events = await calendarService.getAllEvents();
    res.json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// ✗ AVOID
router.get('/events', async (req, res) => {
  const events = await calendarService.getAllEvents();
  res.json(events);  // No error handling
});
```

### Logging

**Log important operations:**
```javascript
// ✓ GOOD
console.log('[INFO] Event created:', eventId);
console.error('[ERROR] Failed to upload file:', error.message);
console.warn('[WARN] Payment method deprecated');

// ✗ AVOID
console.log('ok');
console.log('e');  // Cryptic logs
console.log(userData);  // Sensitive data
```

### Environment Variables

**Always validate environment variables:**
```javascript
// ✓ GOOD
const requiredVars = [
  'JWT_SECRET',
  'GOOGLE_CALENDAR_ID',
  'SPREADSHEET_ID'
];

requiredVars.forEach(varName => {
  if (!process.env[varName]) {
    throw new Error(`Missing required env var: ${varName}`);
  }
});

// ✗ AVOID
// Assuming env vars exist
const secret = process.env.JWT_SECRET;
```

---

## 🔐 Security

### Authentication

**Always hash passwords:**
```javascript
// ✓ GOOD
const hashedPassword = await bcrypt.hash(password, 10);

// ✗ AVOID
const hashedPassword = Buffer.from(password).toString('base64');
```

**Validate JWT tokens:**
```javascript
// ✓ GOOD
const decoded = jwt.verify(token, process.env.JWT_SECRET);
const userId = decoded.id;

// ✗ AVOID
const decoded = jwt.decode(token);  // No verification
```

### CORS

**Whitelist origins:**
```javascript
// ✓ GOOD
const allowedOrigins = [
  'http://localhost:3000',
  'https://osis.example.com'
];

app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

// ✗ AVOID
app.use(cors({
  origin: '*'  // Allows any origin
}));
```

### File Upload

**Validate file type and size:**
```javascript
// ✓ GOOD
const allowed = ['pdf', 'docx', 'xlsx', 'pptx'];
const maxSize = 50 * 1024 * 1024; // 50MB

if (!allowed.includes(file.extension)) {
  return res.status(400).json({ error: 'File type not allowed' });
}

if (file.size > maxSize) {
  return res.status(400).json({ error: 'File too large' });
}

// ✗ AVOID
// Accept any file
res.json({ success: true });
```

### Input Validation

**Always sanitize input:**
```javascript
// ✓ GOOD
const title = req.body.title?.trim() || '';
const priority = ['low', 'medium', 'high'].includes(req.body.priority) 
  ? req.body.priority 
  : 'medium';

if (!title) {
  return res.status(400).json({ error: 'Title required' });
}

// ✗ AVOID
const title = req.body.title;  // No validation
const priority = req.body.priority;  // No whitelist
```

---

## 🧪 Testing

### Unit Tests

**Write tests for utilities:**
```javascript
// ✓ GOOD - test/lib/calculateBalance.test.js
describe('calculateBalance', () => {
  it('returns correct balance', () => {
    const result = calculateBalance(1000, 300);
    expect(result).toBe(700);
  });

  it('handles zero', () => {
    const result = calculateBalance(0, 0);
    expect(result).toBe(0);
  });
});

// ✗ AVOID - No tests
```

### Integration Tests

**Test API endpoints:**
```javascript
// ✓ GOOD
describe('POST /api/auth/login', () => {
  it('returns token on valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'ketua', password: 'password123' });
    
    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeDefined();
  });
});

// ✗ AVOID - Only manual testing
```

### Test Coverage

**Target coverage:**
- Utilities: 100%
- Services: 80%+
- Controllers: 70%+
- Routes: 60%+

---

## 📝 Code Style

### Naming Conventions

**Follow consistent naming:**
```javascript
// ✓ GOOD
const getUserById = async (id) => {};
const isAuthenticated = true;
const MAX_FILE_SIZE = 52428800;
const userId = req.params.id;

// ✗ AVOID
const get_user_by_id = async (id) => {};     // snake_case
const authenticated = true;                   // Unclear if boolean
const maxFileSize = 52428800;                 // Not CONSTANT
const user_id = req.params.id;               // Inconsistent
```

### Comments

**Write meaningful comments:**
```javascript
// ✓ GOOD
// Calculate total including tax at 10%
const total = subtotal * 1.1;

// Handle edge case where user has no division assigned
const division = user.division || 'General';

// ✗ AVOID
// Add subtotal to tax
const total = subtotal * 1.1;

// Get division
const division = user.division || 'General';
```

### Function Length

**Keep functions focused:**
```javascript
// ✓ GOOD - Single responsibility
const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const sendEmail = async (email, subject, body) => {
  // Email sending logic
};

// ✗ AVOID - Too many responsibilities
const registerUser = (email, password) => {
  // Validate email
  // Hash password
  // Create database record
  // Send confirmation email
  // Generate JWT
  // ... 100+ lines
};
```

### Complexity

**Reduce cyclomatic complexity:**
```javascript
// ✓ GOOD - Extract logic
const isValidTransaction = (transaction) => {
  return transaction.amount > 0 && 
         transaction.date && 
         transaction.category;
};

if (!isValidTransaction(transaction)) {
  return res.status(400).json({ error: 'Invalid transaction' });
}

// ✗ AVOID - Complex conditionals
if (transaction.amount > 0 && 
    transaction.date && 
    transaction.category &&
    (transaction.type === 'income' || transaction.type === 'expense') &&
    /* ... more conditions ... */) {
  // ...
}
```

---

## 🔄 Git Workflow

### Commit Messages

**Use clear, descriptive messages:**
```bash
# ✓ GOOD
git commit -m "feat: add drag-drop to kanban board"
git commit -m "fix: prevent duplicate calendar events"
git commit -m "docs: update deployment guide"
git commit -m "refactor: extract calendar service logic"

# ✗ AVOID
git commit -m "update"
git commit -m "fixed stuff"
git commit -m "changes"
```

### Branch Naming

**Use descriptive branch names:**
```bash
# ✓ GOOD
git checkout -b feature/kanban-drag-drop
git checkout -b fix/calendar-sync-bug
git checkout -b docs/deployment-guide

# ✗ AVOID
git checkout -b test
git checkout -b feature1
git checkout -b mychanges
```

### Pull Requests

**Use template for PRs:**
```markdown
## Description
Brief summary of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change

## Testing
- [ ] Unit tests added
- [ ] Manual testing done

## Checklist
- [ ] Code follows style guide
- [ ] Documentation updated
- [ ] No console.log in production code
```

---

## 📚 Documentation

### Code Documentation

**Document complex logic:**
```javascript
// ✓ GOOD
/**
 * Calculates financial summary for given transactions
 * @param {Array} transactions - Array of transaction objects
 * @returns {Object} Summary with total income, expense, and balance
 * @example
 * const summary = calculateFinancialSummary(transactions);
 * // Returns: { totalIncome: 10000, totalExpense: 3000, balance: 7000 }
 */
const calculateFinancialSummary = (transactions) => {
  // ...
};

// ✗ AVOID
// No documentation
const calcFS = (t) => {
  // ...
};
```

### README Files

**Keep updated with current info:**
- Project description
- Tech stack
- Setup instructions
- API endpoints (link to documentation)
- Contributing guidelines

### Changelog

**Maintain changelog:**
```markdown
# Changelog

## [1.1.0] - 2025-02-20
### Added
- Drag-drop support in Kanban board
- Real-time calendar sync

### Fixed
- File upload timeout issue
- Token refresh on expiry

### Changed
- Updated UI colors
```

---

## 🚀 Performance

### Frontend

**Minimize bundle size:**
- Use dynamic imports for routes
- Tree-shake unused code
- Lazy load images

**Optimize rendering:**
- Use React.memo for lists
- Use useCallback for event handlers
- Avoid inline objects/arrays

### Backend

**Optimize queries:**
- Batch API calls
- Cache frequently accessed data
- Limit data returned

**Monitor performance:**
- Track API response times
- Monitor database queries
- Set up performance alerts

---

## 🔍 Code Review Checklist

Before submitting PR, verify:

- [ ] Code follows project style guide
- [ ] No console.log or debug code
- [ ] Tests written/updated
- [ ] Documentation updated
- [ ] No security vulnerabilities
- [ ] No hardcoded secrets
- [ ] Performance acceptable
- [ ] Error handling implemented
- [ ] Accessibility considered
- [ ] Mobile responsive (if applicable)

---

## 📋 Release Checklist

Before production release:

- [ ] All tests passing
- [ ] Code review approved
- [ ] Documentation complete
- [ ] Changelog updated
- [ ] Version bumped
- [ ] Build succeeds
- [ ] Staging deployment works
- [ ] Performance acceptable
- [ ] Security audit passed
- [ ] Rollback plan ready

---

## 🎓 Learning Resources

### Frontend
- [React Documentation](https://react.dev)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

### Backend
- [Express.js Guide](https://expressjs.com)
- [Google APIs Guide](https://developers.google.com)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

### General
- [Clean Code](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)
- [Design Patterns](https://refactoring.guru/design-patterns)
- [Web Security](https://owasp.org/www-project-top-ten/)

---

**Best Practices Version:** 1.0  
**Last Updated:** February 2025
