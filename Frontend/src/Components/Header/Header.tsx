import { Burger, Button, Drawer } from "@mantine/core";
import { IconAnchor, IconX } from "@tabler/icons-react";
import NavLinks from "./NavLinks";
import ProfileMenu from "./ProfileMenu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo } from "react";
import { getProfile } from "../../Services/ProfileService";
import { setProfile } from "../../Slices/ProfileSlice";
import NotiMenu from "./NotiMenu";
import { jwtDecode } from "jwt-decode";
import { setUser } from "../../Slices/UserSlice";
import { setupResponseInterceptor } from "../../Interceptor/AxiosInterceptor";
import { useDisclosure } from "@mantine/hooks";

// Define the link type
interface NavLink {
    name: string;
    url: string;
}

const Header = () => {
    const [opened, { open, close }] = useDisclosure(false);
    const dispatch = useDispatch();
    const user = useSelector((state: any) => state.user);
    const token = useSelector((state: any) => state.jwt);
    const location = useLocation();
    const navigate = useNavigate();
    const accountType = localStorage.getItem("accountType") || "";
    
    // Define links for each role
    const applicantLinks: NavLink[] = [
        {name:"Find Jobs",url:"find-jobs"},
        {name:"Job History", url:"job-history"}
    ];
    
    const employerLinks: NavLink[] = [
        {name:"Find Talent",url:"find-talent"},
        {name:"Post Job",url:"post-job/0"},
        {name:"Posted Jobs",url:"posted-jobs/0"}
    ];
    
    const adminLinks: NavLink[] = [
        {name:"Find Jobs",url:"find-jobs"},
        {name:"Find Talent",url:"find-talent"},
        {name:"Post Job",url:"post-job/0"},
        {name:"Posted Jobs",url:"posted-jobs/0"},
        {name:"Job History", url:"job-history"}
    ];
    
    // Select links based on user role
    const links: NavLink[] = useMemo(() => {
        if (accountType === "APPLICANT") {
            return applicantLinks;
        } else if (accountType === "EMPLOYER") {
            return employerLinks;
        } else if (accountType === "ADMIN") {
            return adminLinks;
        }
        return [] as NavLink[];
    }, [accountType, applicantLinks, employerLinks, adminLinks]);
    
    useEffect(() => {
        setupResponseInterceptor(navigate, dispatch);

    }, [navigate, dispatch])
    const handleClick = (url: string) => {
        navigate(url)
        close();
    }
    useEffect(() => {
        if (token) {
            if (localStorage.getItem("token")) {
                const decoded = jwtDecode(localStorage.getItem("token") || "");
                dispatch(setUser({ ...decoded, email: decoded.sub }));
            }
        }
        if (user?.profileId) {
            getProfile(user?.profileId).then((res) => {
                dispatch(setProfile(res));
            }).catch((err) => console.log(err));
        }
    }, [token, navigate, dispatch, user?.profileId]);
    // Check if we should hide the header
    if (location.pathname === "/signup" || location.pathname === "/login") {
        return null;
    }
    
    return (
        <div className="w-full bg-mine-shaft-950 px-6 text-white h-20 flex justify-between items-center font-['poppins']">
            <div onClick={() => navigate("/")} className="flex gap-1 cursor-pointer items-center text-bright-sun-400">
                <IconAnchor className="h-8 w-8" stroke={2.5} />
                <div className=" xs-mx:hidden text-3xl font-semibold">CareerConnect</div>
            </div>
            <NavLinks />
            <div className="flex gap-3 items-center">
                {user ? <ProfileMenu /> : <Link to="/login" className="text-mine-shaft-200 hover:text-bright-sun-400 "><Button color="brightSun.4" variant="subtle">Login</Button></Link>}
                {user ? <NotiMenu /> : <></>}
                
                {/* Only show burger menu if user is logged in */}
                {user && (
                    <>
                        <Burger className="bs:hidden" opened={opened} onClick={open} aria-label="Toggle navigation" />
                        <Drawer size="xs" overlayProps={{ backgroundOpacity: 0.5, blur: 4 }} position="right" opened={opened} onClose={close} closeButtonProps={{
                            icon: <IconX size={30} />,
                        }} >
                            <div className="flex flex-col gap-6 items-center">
                                {
                                    links.map((link, index) => <div key={index} className=" h-full flex items-center">
                                        <div className="hover:text-bright-sun-400 text-xl " key={index} onClick={() => handleClick(link.url)} >{link.name}</div>
                                    </div>)
                                }
                            </div>
                        </Drawer>
                    </>
                )}
            </div>
        </div>
    );
}
export default Header;