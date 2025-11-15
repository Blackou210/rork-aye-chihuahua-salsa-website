export interface Event {
  id: string;
  title: string;
  location: string;
  address: string;
  date: string;
  startTime: string;
  endTime: string;
  description?: string;
  displayOnHome: boolean;
}

export const EVENTS: Event[] = [
  {
    id: "1",
    title: "New Braunfels Farmers Market",
    location: "Downtown New Braunfels",
    address: "390 S Seguin Ave, New Braunfels, TX 78130",
    date: "2025-11-14",
    startTime: "9:00 AM",
    endTime: "1:00 PM",
    description: "Come visit us at the New Braunfels Farmers Market for fresh salsa!",
    displayOnHome: true,
  },
  {
    id: "2",
    title: "San Antonio Pearl Farmers Market",
    location: "The Pearl",
    address: "312 Pearl Pkwy, San Antonio, TX 78215",
    date: "2025-11-21",
    startTime: "9:00 AM",
    endTime: "1:00 PM",
    description: "Find us at the Pearl Farmers Market this Saturday!",
    displayOnHome: true,
  },
  {
    id: "3",
    title: "New Braunfels Farmers Market",
    location: "Downtown New Braunfels",
    address: "390 S Seguin Ave, New Braunfels, TX 78130",
    date: "2025-11-28",
    startTime: "9:00 AM",
    endTime: "1:00 PM",
    description: "Come visit us at the New Braunfels Farmers Market for fresh salsa!",
    displayOnHome: true,
  },
  {
    id: "4",
    title: "San Antonio Pearl Farmers Market",
    location: "The Pearl",
    address: "312 Pearl Pkwy, San Antonio, TX 78215",
    date: "2025-12-05",
    startTime: "9:00 AM",
    endTime: "1:00 PM",
    description: "Find us at the Pearl Farmers Market this Saturday!",
    displayOnHome: true,
  },
  {
    id: "5",
    title: "New Braunfels Farmers Market",
    location: "Downtown New Braunfels",
    address: "390 S Seguin Ave, New Braunfels, TX 78130",
    date: "2025-12-12",
    startTime: "9:00 AM",
    endTime: "1:00 PM",
    description: "Come visit us at the New Braunfels Farmers Market for fresh salsa!",
    displayOnHome: true,
  },
  {
    id: "6",
    title: "San Antonio Pearl Farmers Market",
    location: "The Pearl",
    address: "312 Pearl Pkwy, San Antonio, TX 78215",
    date: "2025-12-19",
    startTime: "9:00 AM",
    endTime: "1:00 PM",
    description: "Find us at the Pearl Farmers Market this Saturday!",
    displayOnHome: true,
  },
];
