/**
 * Responsive Design Examples and Demo Page
 * Showcases all responsive components for government website
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ResponsiveGrid, 
  ResponsiveContainer, 
  ResponsiveStack,
  ResponsiveSection,
  ResponsiveImage,
  ResponsiveHeading,
  useBreakpoint,
  useCurrentBreakpoint
} from '@/components/layout/ResponsiveLayout';
import ResponsiveTable from '@/components/ui/ResponsiveTable';
import ResponsiveModal, { useResponsiveModal } from '@/components/ui/ResponsiveModal';
import ResponsiveNavigation from '@/components/navigation/ResponsiveNavigation';
import FraudReportForm from '@/components/forms/FraudReportForm';
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  Check, 
  X, 
  Eye,
  Edit,
  Trash2,
  FileText,
  Users,
  BarChart3,
  Settings,
  Home,
  Shield
} from 'lucide-react';

// Sample data for table
const sampleReports = [
  {
    id: 'FR001',
    title: 'Investment Fraud via WhatsApp',
    category: 'Investment Fraud',
    amount: 50000,
    status: 'Under Investigation',
    date: '2024-01-15',
    priority: 'High',
    assignedTo: 'Officer Sharma',
  },
  {
    id: 'FR002',
    title: 'Fake Job Offer Scam',
    category: 'Employment Fraud',
    amount: 15000,
    status: 'Resolved',
    date: '2024-01-10',
    priority: 'Medium',
    assignedTo: 'Officer Kumar',
  },
  {
    id: 'FR003',
    title: 'Credit Card Phishing',
    category: 'Cyber Fraud',
    amount: 25000,
    status: 'Pending Review',
    date: '2024-01-20',
    priority: 'High',
    assignedTo: 'Officer Singh',
  },
];

const tableColumns = [
  {
    key: 'id',
    label: 'Report ID',
    sortable: true,
    sticky: true,
    width: '120px',
  },
  {
    key: 'title',
    label: 'Title',
    sortable: true,
    searchable: true,
    minWidth: '200px',
  },
  {
    key: 'category',
    label: 'Category',
    sortable: true,
    filterable: true,
    hideOnMobile: true,
    render: (value: string) => (
      <Badge variant="outline">{value}</Badge>
    ),
  },
  {
    key: 'amount',
    label: 'Amount',
    sortable: true,
    align: 'right' as const,
    hideOnMobile: true,
    render: (value: number) => `₹${value.toLocaleString('en-IN')}`,
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    render: (value: string) => {
      const variants = {
        'Under Investigation': 'default',
        'Resolved': 'success',
        'Pending Review': 'warning',
      } as const;
      return <Badge variant={variants[value as keyof typeof variants] || 'secondary'}>{value}</Badge>;
    },
  },
  {
    key: 'date',
    label: 'Date',
    sortable: true,
    hideOnMobile: true,
  },
  {
    key: 'priority',
    label: 'Priority',
    hideOnMobile: true,
    render: (value: string) => {
      const colors = {
        High: 'text-red-600',
        Medium: 'text-yellow-600',
        Low: 'text-green-600',
      };
      return <span className={colors[value as keyof typeof colors]}>{value}</span>;
    },
  },
];

const tableActions = [
  {
    label: 'View',
    icon: <Eye className="h-4 w-4" />,
    onClick: (row: any) => console.log('View:', row.id),
    variant: 'outline' as const,
  },
  {
    label: 'Edit',
    icon: <Edit className="h-4 w-4" />,
    onClick: (row: any) => console.log('Edit:', row.id),
    variant: 'outline' as const,
  },
  {
    label: 'Delete',
    icon: <Trash2 className="h-4 w-4" />,
    onClick: (row: any) => console.log('Delete:', row.id),
    variant: 'destructive' as const,
    disabled: (row: any) => row.status === 'Resolved',
  },
];

// Navigation items
const navItems = [
  {
    id: 'home',
    label: 'Home',
    href: '/',
    icon: <Home className="h-4 w-4" />,
  },
  {
    id: 'reports',
    label: 'Reports',
    href: '/reports',
    icon: <FileText className="h-4 w-4" />,
    badge: '12',
    children: [
      { id: 'create-report', label: 'Create Report', href: '/reports/create' },
      { id: 'my-reports', label: 'My Reports', href: '/reports/mine' },
      { id: 'all-reports', label: 'All Reports', href: '/reports/all' },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    href: '/analytics',
    icon: <BarChart3 className="h-4 w-4" />,
  },
  {
    id: 'users',
    label: 'Users',
    href: '/users',
    icon: <Users className="h-4 w-4" />,
    desktopOnly: true,
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/settings',
    icon: <Settings className="h-4 w-4" />,
  },
];

const ResponsiveExamples: React.FC = () => {
  const { isOpen: isModalOpen, openModal, closeModal } = useResponsiveModal();
  const { isOpen: isFormModalOpen, openModal: openFormModal, closeModal: closeFormModal } = useResponsiveModal();
  
  const isLargeScreen = useBreakpoint('lg');
  const currentBreakpoint = useCurrentBreakpoint();
  
  // Mock user data
  const mockUser = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Senior Officer',
    avatar: undefined,
  };

  const mockActions = {
    notifications: {
      count: 5,
      onClick: () => console.log('Notifications clicked'),
    },
    search: {
      onSearch: (query: string) => console.log('Search:', query),
      placeholder: 'Search reports...',
    },
    user: {
      onProfile: () => console.log('Profile clicked'),
      onSettings: () => console.log('Settings clicked'),
      onLogout: () => console.log('Logout clicked'),
    },
  };

  const handleFormSubmit = async (data: any) => {
    console.log('Form submitted:', data);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
    closeFormModal();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Responsive Navigation Demo */}
      <ResponsiveNavigation
        brand={{
          name: 'Chakshu Portal',
          logo: <Shield className="h-8 w-8 text-blue-600" />,
          href: '/',
        }}
        items={navItems}
        user={mockUser}
        actions={mockActions}
        variant="government"
        sticky
      />

      <ResponsiveContainer maxWidth="screen" padding margin className="py-8">
        <ResponsiveHeading level={1} className="text-center mb-8">
          Responsive Design System Demo
        </ResponsiveHeading>

        {/* Breakpoint Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Monitor className="h-5 w-5" />
              <span>Current Breakpoint</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-lg px-4 py-2">
                {currentBreakpoint.toUpperCase()}
              </Badge>
              <div className="flex items-center space-x-2">
                <Smartphone className={`h-4 w-4 ${currentBreakpoint === 'sm' ? 'text-blue-600' : 'text-gray-400'}`} />
                <Tablet className={`h-4 w-4 ${currentBreakpoint === 'md' ? 'text-blue-600' : 'text-gray-400'}`} />
                <Monitor className={`h-4 w-4 ${['lg', 'xl', '2xl'].includes(currentBreakpoint) ? 'text-blue-600' : 'text-gray-400'}`} />
              </div>
              <span className="text-sm text-muted-foreground">
                Large screen: {isLargeScreen ? 'Yes' : 'No'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="layout" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="layout">Layout System</TabsTrigger>
            <TabsTrigger value="forms">Forms & Validation</TabsTrigger>
            <TabsTrigger value="tables">Data Tables</TabsTrigger>
            <TabsTrigger value="modals">Modals & Dialogs</TabsTrigger>
          </TabsList>

          {/* Layout System Demo */}
          <TabsContent value="layout" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Responsive Grid System</CardTitle>
                <CardDescription>
                  Mobile-first grid with configurable breakpoints
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveGrid 
                  cols={{ default: 1, sm: 2, md: 3, lg: 4 }} 
                  gap={4}
                  className="mb-6"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <Card key={num}>
                      <CardContent className="p-4 text-center">
                        <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-4">
                          Grid Item {num}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </ResponsiveGrid>

                <div className="text-sm text-muted-foreground">
                  Grid adjusts from 1 column on mobile to 4 columns on desktop
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Responsive Stack (Flexbox)</CardTitle>
                <CardDescription>
                  Flexible direction changes based on screen size
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveStack
                  direction={{ default: 'column', md: 'row' }}
                  gap={4}
                  align="center"
                  justify="between"
                  className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg"
                >
                  <div className="bg-green-100 dark:bg-green-900 p-4 rounded">Item 1</div>
                  <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded">Item 2</div>
                  <div className="bg-red-100 dark:bg-red-900 p-4 rounded">Item 3</div>
                </ResponsiveStack>
                <div className="text-sm text-muted-foreground mt-2">
                  Stacks vertically on mobile, horizontally on desktop
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Responsive Typography</CardTitle>
                <CardDescription>
                  Typography that scales with screen size
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ResponsiveHeading level={1}>Main Heading (H1)</ResponsiveHeading>
                <ResponsiveHeading level={2}>Section Heading (H2)</ResponsiveHeading>
                <ResponsiveHeading level={3}>Subsection Heading (H3)</ResponsiveHeading>
                <ResponsiveHeading level={4}>Component Heading (H4)</ResponsiveHeading>
                <p className="text-base sm:text-lg">
                  This paragraph text also responds to screen size changes for optimal readability.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Forms Demo */}
          <TabsContent value="forms" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Government Fraud Report Form</CardTitle>
                <CardDescription>
                  Comprehensive form with validation, progress tracking, and mobile optimization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={openFormModal} className="mb-4">
                  Open Fraud Report Form
                </Button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium mb-2">Features:</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Real-time validation</li>
                      <li>• Multi-step progression</li>
                      <li>• Government field validation</li>
                      <li>• Touch-friendly controls</li>
                      <li>• Progress tracking</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Validation:</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Aadhaar number format</li>
                      <li>• PAN number validation</li>
                      <li>• Indian mobile numbers</li>
                      <li>• PIN code validation</li>
                      <li>• File type restrictions</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tables Demo */}
          <TabsContent value="tables" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Responsive Data Table</CardTitle>
                <CardDescription>
                  Tables that adapt to mobile with card view and horizontal scroll
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveTable
                  data={sampleReports}
                  columns={tableColumns}
                  actions={tableActions}
                  searchable
                  sortable
                  exportable
                  pagination={{
                    page: 1,
                    pageSize: 10,
                    total: sampleReports.length,
                    onPageChange: (page) => console.log('Page:', page),
                    onPageSizeChange: (size) => console.log('Page size:', size),
                  }}
                  mobileView="cards"
                  onRowClick={(row) => console.log('Row clicked:', row)}
                  onExport={() => console.log('Export clicked')}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Modals Demo */}
          <TabsContent value="modals" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Responsive Modal System</CardTitle>
                <CardDescription>
                  Modals that use drawers on mobile and dialogs on desktop
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveStack direction="row" gap={4} wrap>
                  <Button onClick={openModal}>
                    Standard Modal
                  </Button>
                  <Button variant="outline" onClick={() => {}}>
                    Alert Modal
                  </Button>
                  <Button variant="outline" onClick={() => {}}>
                    Form Modal
                  </Button>
                </ResponsiveStack>

                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <h4 className="font-medium mb-2">Modal Behavior:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div>
                      <strong>Desktop (lg+):</strong>
                      <ul className="mt-1 space-y-1">
                        <li>• Centered dialog</li>
                        <li>• Overlay background</li>
                        <li>• Click outside to close</li>
                        <li>• Escape key support</li>
                      </ul>
                    </div>
                    <div>
                      <strong>Mobile (< lg):</strong>
                      <ul className="mt-1 space-y-1">
                        <li>• Bottom sheet drawer</li>
                        <li>• Swipe to close</li>
                        <li>• Full width content</li>
                        <li>• Touch-friendly buttons</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mobile Optimization Features</CardTitle>
                <CardDescription>
                  Touch-friendly design elements and responsive behaviors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveGrid cols={{ default: 1, md: 2, lg: 3 }} gap={4}>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Check className="h-4 w-4 text-green-600 mr-2" />
                      Touch Targets
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Minimum 44px height for all interactive elements following WCAG AA guidelines
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Check className="h-4 w-4 text-green-600 mr-2" />
                      Responsive Typography
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Text scales appropriately across devices for optimal readability
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Check className="h-4 w-4 text-green-600 mr-2" />
                      Flexible Layouts
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Grid and flexbox systems adapt to any screen size seamlessly
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Check className="h-4 w-4 text-green-600 mr-2" />
                      Mobile Navigation
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Hamburger menu with collapsible sections and touch-friendly spacing
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Check className="h-4 w-4 text-green-600 mr-2" />
                      Form Optimization
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Large input fields, clear labels, and real-time validation feedback
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Check className="h-4 w-4 text-green-600 mr-2" />
                      Progressive Enhancement
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Core functionality works without JavaScript, enhanced with interactions
                    </p>
                  </div>
                </ResponsiveGrid>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Sample Modal */}
        <ResponsiveModal
          open={isModalOpen}
          onOpenChange={closeModal}
          title="Sample Modal"
          description="This modal demonstrates responsive behavior"
          size="md"
        >
          <div className="space-y-4">
            <p>
              This modal automatically switches between a dialog on desktop and a drawer on mobile.
              Try resizing your browser window to see the behavior change.
            </p>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
              <p className="text-sm">
                <strong>Current breakpoint:</strong> {currentBreakpoint}
              </p>
              <p className="text-sm">
                <strong>Modal type:</strong> {isLargeScreen ? 'Dialog' : 'Drawer'}
              </p>
            </div>
          </div>
        </ResponsiveModal>

        {/* Form Modal */}
        <ResponsiveModal
          open={isFormModalOpen}
          onOpenChange={closeFormModal}
          title="Fraud Report Form"
          size="full"
          mobileHeight="full"
        >
          <FraudReportForm
            onSubmit={handleFormSubmit}
            onCancel={closeFormModal}
            mode="create"
            multiStep
            showProgress
          />
        </ResponsiveModal>
      </ResponsiveContainer>
    </div>
  );
};

export default ResponsiveExamples;