import PackageSwiper from "./components/PackageSwiper";
import ShowCommentSwiper from "./components/ShowCommentSwiper";
import Header from "./Header";
import IntroSection from "./IntroSection";

export default function HomePage() {
    return (<> < Header /> <IntroSection/>
    <PackageSwiper/>
    <ShowCommentSwiper />
</>);
}