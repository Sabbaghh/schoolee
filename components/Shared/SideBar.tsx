'use client';
import {
  School,
  BookOpen,
  Building2,
  Package2,
  Info,
  CalendarMinus2,
  TableOfContents,
  Phone,
  Linkedin,
  Facebook,
  Instagram,
  X,
} from 'lucide-react';

import {
  useSidebar,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from '@/components/ui/sidebar';
// Menu items.
const items = [
  {
    title: 'Schools',
    url: '/results?model_type=school',
    icon: School,
  },
  {
    title: 'Academies & Activities',
    url: '/results?model_type=academy',
    icon: BookOpen,
  },
  {
    title: 'Centers',
    url: '/results?model_type=center',
    icon: Building2,
  },
  {
    title: 'Coaching & Tutoring',
    url: '/results?model_type=instructor',
    icon: Package2,
  },
];
const Links = [
  {
    title: 'About us',
    url: '/results?model_type=school',
    icon: Info,
  },
  {
    title: 'Blog',
    url: '/results?model_type=academy',
    icon: CalendarMinus2,
  },
  {
    title: `FAQ's`,
    url: '/results?model_type=center',
    icon: TableOfContents,
  },
  {
    title: 'Get in touch',
    url: '/results?model_type=instructor',
    icon: Phone,
  },
];

const Social = [
  {
    title: 'Linkedin',
    url: '/results?model_type=school',
    icon: Linkedin,
  },
  {
    title: 'Facebok',
    url: '/results?model_type=academy',
    icon: Facebook,
  },
  {
    title: `Instagram`,
    url: '/results?model_type=center',
    icon: Instagram,
  },
  {
    title: 'X',
    url: '/results?model_type=instructor',
    icon: X,
  },
  {
    title: 'Mobile',
    url: '/results?model_type=instructor',
    icon: Phone,
  },
];

function SideBar() {
  const { toggleSidebar } = useSidebar();
  return (
    <Sidebar side="right" variant="floating" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          {/* <SidebarGroupLabel>Quick Naviagtion</SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={toggleSidebar} asChild>
                  <div>
                    <div className="bg-secondary/10 rounded-full flex justify-center items-center">
                      <i className="fas fa-bars text-[15px] text-primary"></i>
                    </div>
                    <span>close</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {Links.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {Social.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default SideBar;
