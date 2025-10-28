'use client';

import { Button } from '@/components/ui/button';

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
  Menu,
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
    url: '/s?t=school',
    icon: School,
  },
  {
    title: 'Academies & Activities',
    url: '/s?t=academy',
    icon: BookOpen,
  },
  {
    title: 'Centers',
    url: '/s?t=center',
    icon: Building2,
  },
  {
    title: 'Coaching & Tutoring',
    url: '/s?t=instructor',
    icon: Package2,
  },
];
const Links = [
  {
    title: 'About us',
    url: '/s?t=school',
    icon: Info,
  },
  {
    title: 'Blog',
    url: '/s?t=academy',
    icon: CalendarMinus2,
  },
  {
    title: `FAQ's`,
    url: '/s?t=center',
    icon: TableOfContents,
  },
  {
    title: 'Get in touch',
    url: '/s?t=instructor',
    icon: Phone,
  },
];

const Social = [
  {
    title: 'Linkedin',
    url: '/s?t=school',
    icon: Linkedin,
  },
  {
    title: 'Facebok',
    url: '/s?t=academy',
    icon: Facebook,
  },
  {
    title: `Instagram`,
    url: '/s?t=center',
    icon: Instagram,
  },
  {
    title: 'X',
    url: '/s?t=instructor',
    icon: X,
  },
  {
    title: 'Mobile',
    url: '/s?t=instructor',
    icon: Phone,
  },
];

import LangaugeSelector from '@/components/Shared/Langauge-Selector';

function SideBar() {
  const { toggleSidebar } = useSidebar();
  return (
    <>
      <Button
        onClick={toggleSidebar}
        className="absolute bg-transparent top-7 right-10 block md:hidden"
      >
        <Menu />
      </Button>
      <Sidebar collapsible="icon" side="right" variant="floating">
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
            {/* <SidebarMenuItem>
              <LangaugeSelector />
            </SidebarMenuItem> */}
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
    </>
  );
}

export default SideBar;
