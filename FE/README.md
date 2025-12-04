# Online Selling System

A modern e-commerce web application built with React, TypeScript, and Tailwind CSS. Features a complete shopping experience with customer, staff, and admin portals.

## 🚀 Features

### Customer Portal
- **Home Page** - Featured products and promotions
- **Product Listing** - Browse products with filtering and sorting
- **Product Details** - Detailed product information and images
- **Shopping Cart** - Add, remove, and update quantities
- **Checkout** - Complete purchase with shipping and payment
- **Order Confirmation** - Purchase confirmation with order details
- **Order Status** - Track order progress

### Staff Portal
- **Product Management** - Add, edit, and manage product inventory
- **Order Management** - View and process customer orders
- **Product Modification** - Update product details and pricing

### Admin Portal
- **User Management** - Manage staff and admin accounts
- **System Settings** - Configure notification templates and system options
- **Template Preview** - Email and SMS notification templates

## 🛠️ Tech Stack

| Technology | Description |
|------------|-------------|
| React 18 | UI library |
| TypeScript | Type safety |
| Vite 6 | Build tool and dev server |
| Tailwind CSS 4 | Utility-first CSS framework |
| Radix UI | Accessible UI primitives |
| Lucide React | Icon library |
| Sonner | Toast notifications |
| Class Variance Authority | Component variants |

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/Phuchoang2004/Onlinesellingsystemuidesign.git

# Navigate to project directory
cd SAD

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at **http://localhost:3000**

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server at http://localhost:3000 |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                  # Reusable UI components
│   │   ├── button.tsx       # Button component with variants
│   │   ├── input.tsx        # Text input component
│   │   ├── select.tsx       # Dropdown select
│   │   ├── dialog.tsx       # Modal dialogs
│   │   ├── tabs.tsx         # Tabbed navigation
│   │   ├── table.tsx        # Data tables
│   │   ├── badge.tsx        # Status badges
│   │   ├── card.tsx         # Content cards
│   │   ├── checkbox.tsx     # Checkbox inputs
│   │   ├── radio-group.tsx  # Radio button groups
│   │   ├── slider.tsx       # Range sliders
│   │   ├── textarea.tsx     # Multi-line text input
│   │   ├── label.tsx        # Form labels
│   │   └── sonner.tsx       # Toast notifications
│   ├── pages/               # Customer-facing pages
│   │   ├── HomePage.tsx
│   │   ├── ProductListingPage.tsx
│   │   ├── ProductDetailsPage.tsx
│   │   ├── CartPage.tsx
│   │   ├── CheckoutPage.tsx
│   │   ├── OrderConfirmationPage.tsx
│   │   └── OrderStatusPage.tsx
│   ├── staff/               # Staff portal components
│   │   ├── StaffLayout.tsx
│   │   ├── StaffLoginPage.tsx
│   │   ├── ProductManagementPage.tsx
│   │   ├── ProductModificationPage.tsx
│   │   └── OrderManagementPage.tsx
│   ├── admin/               # Admin portal components
│   │   ├── AdminLayout.tsx
│   │   ├── AdminLoginPage.tsx
│   │   ├── UserManagementPage.tsx
│   │   └── SystemSettingsPage.tsx
│   ├── templates/           # Notification templates
│   │   ├── TemplatePreviewPage.tsx
│   │   ├── EmailTemplate.tsx
│   │   └── SMSTemplate.tsx
│   ├── figma/               # Image components
│   │   └── ImageWithFallback.tsx
│   ├── Header.tsx           # Main header with navigation
│   ├── Footer.tsx           # Site footer
│   ├── ProductCard.tsx      # Product card component
│   └── UnifiedLoginPage.tsx # Role-based login
├── data/
│   └── mockData.ts          # Mock data for development
├── lib/
│   └── utils.ts             # Utility functions (cn helper)
├── App.tsx                  # Main application with routing
├── main.tsx                 # Entry point
├── index.css                # Global styles and Tailwind config
└── types.ts                 # TypeScript type definitions
```

## 🎨 UI Components

The project uses a custom UI component library built on Radix UI primitives:

### Form Components
- **Button** - Primary, secondary, outline, ghost, destructive variants
- **Input** - Text input with label support
- **Textarea** - Multi-line text input
- **Select** - Dropdown selection
- **Checkbox** - Checkbox inputs
- **Radio Group** - Radio button groups
- **Slider** - Range sliders
- **Label** - Form labels

### Display Components
- **Card** - Content cards with header, content, footer
- **Badge** - Status badges with color variants
- **Table** - Data tables with header, body, cells
- **Dialog** - Modal dialogs
- **Tabs** - Tabbed navigation

### Feedback
- **Sonner/Toast** - Toast notifications

## 🔐 User Roles & Navigation

| Role | Default Page | Available Pages |
|------|--------------|-----------------|
| Customer | Home | Products, Cart, Checkout, Orders |
| Staff | Product Management | Orders, Product Editing |
| Admin | User Management | System Settings, Templates |

### Navigation Flow

```
Customer Flow:
Home → Products → Product Details → Cart → Checkout → Order Confirmation → Order Status

Staff Flow:
Login → Product Management ↔ Order Management ↔ Product Modification

Admin Flow:
Login → User Management ↔ System Settings ↔ Template Preview
```

## 🎯 Key Features

### Shopping Experience
- Browse products with category filtering
- View detailed product information
- Add items to cart with quantity management
- Secure checkout process
- Order tracking and status updates

### Staff Management
- View and manage product inventory
- Process and update order statuses
- Add new products or edit existing ones

### Admin Control
- Create and manage user accounts
- Configure system-wide settings
- Preview email and SMS notification templates

## 📱 Responsive Design

The application is fully responsive and optimized for:

| Device | Breakpoint |
|--------|------------|
| Mobile | < 640px |
| Tablet | 640px - 1024px |
| Desktop | > 1024px |

## 🎨 Theme Configuration

The theme uses CSS custom properties for easy customization. Edit `src/index.css`:

```css
:root {
  --primary: #030213;
  --background: #ffffff;
  --foreground: oklch(0.145 0 0);
  --muted: #ececf0;
  --accent: #e9ebef;
  --destructive: #d4183d;
  --border: rgba(0, 0, 0, 0.1);
  --radius: 0.625rem;
}
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 👥 Authors

- **Phuc Hoang** - [GitHub](https://github.com/Phuchoang2004)

---

Made with ❤️ using React, TypeScript & Tailwind CSS
