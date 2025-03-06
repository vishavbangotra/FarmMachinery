const SearchData = [
  {
    "distance": "5 km",
    "machinery": "Tractor with Rotavator",
    "operation": "Field Preparation",
    "availability_date": "2023-11-15",
    "owner_name": "Rajesh Kumar",
    "owner_image": "https://dummyimage.com/50x50/000/fff&text=RK",
    "vehicle_image": "https://dummyimage.com/100x100/ccc/000&text=Tractor",
    "owner_star_rating": 4.5
  },
  {
    "distance": "12 km",
    "machinery": "Seed Drill",
    "operation": "Sowing & Planting",
    "availability_date": "2023-11-14",
    "owner_name": "Anil Sharma",
    "owner_image": "https://dummyimage.com/50x50/000/fff&text=AS",
    "vehicle_image": "https://dummyimage.com/100x100/ccc/000&text=SeedDrill",
    "owner_star_rating": 4.2
  },
  {
    "distance": "8 km",
    "machinery": "Cono Weeder",
    "operation": "Weeding",
    "availability_date": "2023-11-16",
    "owner_name": "Priya Singh",
    "owner_image": "https://dummyimage.com/50x50/000/fff&text=PS",
    "vehicle_image": "https://dummyimage.com/100x100/ccc/000&text=ConoWeeder",
    "owner_star_rating": 4.7
  },
  {
    "distance": "15 km",
    "machinery": "Knapsack Sprayer",
    "operation": "Spraying",
    "availability_date": "2023-11-13",
    "owner_name": "Vikram Patel",
    "owner_image": "https://dummyimage.com/50x50/000/fff&text=VP",
    "vehicle_image": "https://dummyimage.com/100x100/ccc/000&text=Sprayer",
    "owner_star_rating": 4.0
  },
  {
    "distance": "20 km",
    "machinery": "Combine Harvester",
    "operation": "Harvest & Threshing",
    "availability_date": "2023-11-17",
    "owner_name": "Suresh Yadav",
    "owner_image": "https://dummyimage.com/50x50/000/fff&text=SY",
    "vehicle_image": "https://dummyimage.com/100x100/ccc/000&text=Harvester",
    "owner_star_rating": 4.8
  },
  {
    "distance": "10 km",
    "machinery": "Happy Seeder",
    "operation": "Paddy Straw Management",
    "availability_date": "2023-11-18",
    "owner_name": "Manoj Gupta",
    "owner_image": "https://dummyimage.com/50x50/000/fff&text=MG",
    "vehicle_image": "https://dummyimage.com/100x100/ccc/000&text=HappySeeder",
    "owner_star_rating": 4.3
  },
  {
    "distance": "7 km",
    "machinery": "Manual Chaff Cutter",
    "operation": "Hand Chopper",
    "availability_date": "2023-11-19",
    "owner_name": "Ramesh Verma",
    "owner_image": "https://dummyimage.com/50x50/000/fff&text=RV",
    "vehicle_image": "https://dummyimage.com/100x100/ccc/000&text=ChaffCutter",
    "owner_star_rating": 4.1
  },
  {
    "distance": "18 km",
    "machinery": "Chaff Cutter",
    "operation": "Fodder Harvesting",
    "availability_date": "2023-11-20",
    "owner_name": "Deepak Singh",
    "owner_image": "https://dummyimage.com/50x50/000/fff&text=DS",
    "vehicle_image": "https://dummyimage.com/100x100/ccc/000&text=ChaffCutter",
    "owner_star_rating": 4.6
  },
  {
    "distance": "25 km",
    "machinery": "Airblast Sprayer",
    "operation": "Orchard Machinery",
    "availability_date": "2023-11-21",
    "owner_name": "Ajay Mehta",
    "owner_image": "https://dummyimage.com/50x50/000/fff&text=AM",
    "vehicle_image": "https://dummyimage.com/100x100/ccc/000&text=Sprayer",
    "owner_star_rating": 4.4
  },
  {
    "distance": "6 km",
    "machinery": "Tractor with Disc Plough",
    "operation": "Field Preparation",
    "availability_date": "2023-11-22",
    "owner_name": "Sunil Kumar",
    "owner_image": "https://dummyimage.com/50x50/000/fff&text=SK",
    "vehicle_image": "https://dummyimage.com/100x100/ccc/000&text=DiscPlough",
    "owner_star_rating": 4.7
  },
  {
    "distance": "14 km",
    "machinery": "Rice Transplanter",
    "operation": "Sowing & Planting",
    "availability_date": "2023-11-23",
    "owner_name": "Rahul Sharma",
    "owner_image": "https://dummyimage.com/50x50/000/fff&text=RS",
    "vehicle_image": "https://dummyimage.com/100x100/ccc/000&text=Transplanter",
    "owner_star_rating": 4.5
  },
  {
    "distance": "9 km",
    "machinery": "Power Weeder",
    "operation": "Weeding",
    "availability_date": "2023-11-24",
    "owner_name": "Neha Gupta",
    "owner_image": "https://dummyimage.com/50x50/000/fff&text=NG",
    "vehicle_image": "https://dummyimage.com/100x100/ccc/000&text=PowerWeeder",
    "owner_star_rating": 4.2
  },
  {
    "distance": "11 km",
    "machinery": "Tractor-Mounted Boom Sprayer",
    "operation": "Spraying",
    "availability_date": "2023-11-25",
    "owner_name": "Arun Singh",
    "owner_image": "https://dummyimage.com/50x50/000/fff&text=AS",
    "vehicle_image": "https://dummyimage.com/100x100/ccc/000&text=BoomSprayer",
    "owner_star_rating": 4.6
  },
  {
    "distance": "16 km",
    "machinery": "Pedal Thresher",
    "operation": "Harvest & Threshing",
    "availability_date": "2023-11-26",
    "owner_name": "Vijay Kumar",
    "owner_image": "https://dummyimage.com/50x50/000/fff&text=VK",
    "vehicle_image": "https://dummyimage.com/100x100/ccc/000&text=Thresher",
    "owner_star_rating": 4.3
  },
  {
    "distance": "22 km",
    "machinery": "Straw Baler",
    "operation": "Paddy Straw Management",
    "availability_date": "2023-11-27",
    "owner_name": "Sanjay Patel",
    "owner_image": "https://dummyimage.com/50x50/000/fff&text=SP",
    "vehicle_image": "https://dummyimage.com/100x100/ccc/000&text=StrawBaler",
    "owner_star_rating": 4.8
  },
  {
    "distance": "13 km",
    "machinery": "Electric Chaff Cutter",
    "operation": "Hand Chopper",
    "availability_date": "2023-11-28",
    "owner_name": "Pankaj Verma",
    "owner_image": "https://dummyimage.com/50x50/000/fff&text=PV",
    "vehicle_image": "https://dummyimage.com/100x100/ccc/000&text=ChaffCutter",
    "owner_star_rating": 4.4
  },
  {
    "distance": "17 km",
    "machinery": "Forage Harvester",
    "operation": "Fodder Harvesting",
    "availability_date": "2023-11-29",
    "owner_name": "Rohit Yadav",
    "owner_image": "https://dummyimage.com/50x50/000/fff&text=RY",
    "vehicle_image": "https://dummyimage.com/100x100/ccc/000&text=ForageHarvester",
    "owner_star_rating": 4.7
  },
  {
    "distance": "19 km",
    "machinery": "Pruning Saw",
    "operation": "Orchard Machinery",
    "availability_date": "2023-11-30",
    "owner_name": "Amit Sharma",
    "owner_image": "https://dummyimage.com/50x50/000/fff&text=AS",
    "vehicle_image": "https://dummyimage.com/100x100/ccc/000&text=PruningSaw",
    "owner_star_rating": 4.1
  },
  {
    "distance": "4 km",
    "machinery": "Laser Land Leveler",
    "operation": "Field Preparation",
    "availability_date": "2023-12-01",
    "owner_name": "Nitin Kumar",
    "owner_image": "https://dummyimage.com/50x50/000/fff&text=NK",
    "vehicle_image": "https://dummyimage.com/100x100/ccc/000&text=LaserLeveler",
    "owner_star_rating": 4.9
  },
  {
    "distance": "21 km",
    "machinery": "Potato Planter",
    "operation": "Sowing & Planting",
    "availability_date": "2023-12-02",
    "owner_name": "Ravi Singh",
    "owner_image": "https://dummyimage.com/50x50/000/fff&text=RS",
    "vehicle_image": "https://dummyimage.com/100x100/ccc/000&text=PotatoPlanter",
    "owner_star_rating": 4.5
  }
]

export default SearchData;