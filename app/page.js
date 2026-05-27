import PackageSwiper from "./components/PackageSwiper";
import Programmers from "./components/Programmers";
import ShowCommentSwiper from "./components/ShowCommentSwiper";
import Videos from "./components/Videos";
import Header from "./Header";
import IntroSection from "./IntroSection";
import Footer from "./components/Footer";
import { auth } from "../auth";




export default async  function HomePage() {
    const session = await auth();
    return (<> < Header session={session} /> <IntroSection/>
    <PackageSwiper />
    <ShowCommentSwiper />
    <Programmers />
    <Videos/>
    <Footer />
</>);
}