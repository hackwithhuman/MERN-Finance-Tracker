import { LuLayoutDashboard , LuHandCoins , LuWalletMinimal , LuLogOut } from "react-icons/lu";


export const sideMenuData = [
    {
id:"01",
label: "dashBoard",
icon: LuLayoutDashboard,
paath: "/",

    },
    {
        id:'02',
        label: "Income",
        icon: LuWalletMinimal,
        path: 'income'
    },
    {
        id:'03',
        label: "Expense",
        icon : LuHandCoins,
        path: "expense"
    }
    ,
    {
        id:'05',
        label:"LogOut",
        icon:LuLogOut,
        path:'logout'
    }
];
