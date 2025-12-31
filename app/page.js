import PackageSwiper from "./components/PackageSwiper";
import Programmers from "./components/Programmers";
import ShowCommentSwiper from "./components/ShowCommentSwiper";
import Videos from "./components/Videos";
import Header from "./Header";
import IntroSection from "./IntroSection";

export default  function HomePage() {
    
    return (<> < Header /> <IntroSection/>
    <PackageSwiper/>
    <ShowCommentSwiper />
    <Programmers />
    <Videos/>
</>);
}