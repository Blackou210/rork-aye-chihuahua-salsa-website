export interface Event {
  id: string;
  title: string;
  location: string;
  address: string;
  date: string;
  startTime: string;
  endTime: string;
  description?: string;
}

export const EVENTS: Event[] = [
  {
    id: "1",
    title: "New Braunfels Farmers Market",
    location: "Downtown New Braunfels",
    address: "390 S Seguin Ave, New Braunfels, TX 78130",
    date: "2025-11-16",
    startTime: "9:00 AM",
    endTime: "1:00 PM",
    description: "Come visit us at the New Braunfels Farmers Market for fresh salsa!",
  },
  {
    id: "2",
    title: "San Antonio Pearl Farmers Market",
    location: "The Pearl",
    address: "312 Pearl Pkwy, San Antonio, TX 78215",
    date: "2025-11-23",
    startTime: "9:00 AM",
    endTime: "1:00 PM",
    description: "Find us at the Pearl Farmers Market this Saturday!",
  },
  {
    id: "3",
    title: "New Braunfels Farmers Market",
    location: "Downtown New Braunfels",
    address: "390 S Seguin Ave, New Braunfels, TX 78130",
    date: "2025-11-30",
    startTime: "9:00 AM",
    endTime: "1:00 PM",
    description: "Come visit us at the New Braunfels Farmers Market for fresh salsa!",
  },
  {
    id: "4",
    title: "San Antonio Pearl Farmers Market",
    location: "The Pearl",
    address: "312 Pearl Pkwy, San Antonio, TX 78215",
    date: "2025-12-07",
    startTime: "9:00 AM",
    endTime: "1:00 PM",
    description: "Find us at the Pearl Farmers Market this Saturday!",
  },
];
