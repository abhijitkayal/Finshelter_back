import React from "react";
import Section1 from "../Section1/Section1";
import Section3 from "../Section3/Section3";
import Section5 from "../Section5/Section5";
import Section6 from "../Section6/Section6";
import Section7 from "../Section7/Section7";
import Section9 from "../Section9/Section9";
import Section8 from "../Section8/Section8";
import Section11 from "../Section11/Section11";
import { withNotificationsDisabled } from "../../NotificationContext";

const Home = () => {
	return (
		<>
			<Section1 />
			<Section7 />
			<Section3 />
			<Section6 />
			<Section5 />
			<Section9 />
			<Section8 />
			{/* <Section11 /> */}
		</>
	);
};

export default withNotificationsDisabled(Home);
