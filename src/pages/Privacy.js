import { useEffect } from "react";
import { Link } from "../../node_modules/react-router-dom/dist/index";
import BackButton from "../components/BackButton";
import { title } from "../constants/index";

export default function Privacy() {
  useEffect(() => {
    window.analytics.page();
    document.title = `Privacy Policy - ${title}`;
  }, []);
  const termsConditions = [
    "<span style='font-weight: bolder; font-size: larger'>Personal details:</span> your username or log in details; e-mail id; contact number(s);",
    "<span style='font-weight: bolder; font-size: larger'>Booking information:</span> which includes information about your travel, bookings, co-passengers, travel preferences, etc.",
    "<span style='font-weight: bolder; font-size: larger'>Demographic information:</span> gender; age/date of birth; nationality;",
    "<span style='font-weight: bolder; font-size: larger'>Location information:</span> location data that describes the precise geographic location of your device (“Precise Location Data”);",
    "<span style='font-weight: bolder; font-size: larger'>Purchase and payment details:</span> records of travel services purchases and prices; invoice records; payment records; payment method; cardholder or accountholder name; payment amount; and payment date;",
    "the information that may be requested or gathered while you visit, access or use the Booking Platform; and",
    "We may also Process information about you from your use of our Services (e.g., the type of device you are using, I.P address, the internet service provider, etc)",
  ];
  const content2 = [
    "Information about your use of the Services, such as usage data and statistical information, which may be aggregated;",
    "Browsing history on the Booking Platform;",
    "Non-precise information about the approximate physical location (for example, at the city) of a user’s computer or device derived from the IP address of such computer or device (“GeoIP Data”);",
    "Device identification (“ID”), which is a distinctive number associated with a smartphone or similar handheld device, but is different than a hardware serial number.",
    "Internet Protocol (“IP”) address, which is a unique string of numbers automatically assigned to your device whenever you access the Internet.",
    "Internet connection means, such as internet service provider (“ISP”), mobile operator, WiFi connection, service set identifier (“SSID”), International Mobile Subscriber Identity (“IMSI”), and International Mobile Equipment Identity (“IMEI”).",
    "Information collected through the use of cookies, eTags, Javascript, pixel tags, device ID tracking, anonymous identifiers and other technologies, including information collected using such methods and technologies about (i) your visits to the Platform and engagement with, the Services, content, and ads on third party websites, applications, platforms, and other media channels (“Channels”), and (ii) your interaction with emails including the content and ads therein (collectively, “Online Data”);",
    "Device type, settings and software used;",
    "Log files, which may include IP addresses, browser type, ISP referring/exit pages, operating system;",
    "Web Beacons, which are electronic files that allow a website to count users who have visited that page or to access certain cookies;",
    "Pixel Tags, also known as clear GIFs, beacons, spotlight tags or web bugs, which are a method for passing information from the user’s computer to a third party website;",
    "Local Shared Objects, such as Flash cookies, and Local Storage, such as HTML5;",
    "Mobile analytics to understand the functionality of our mobile applications and software on your phone.",
  ];

  const content3 = [
    "We may Process your User Information by placing or reading Cookies or similar technologies on the Services and Channels. Certain tracking technologies enable us to assign a unique identifier to you and relate information about your use of the Services to Other Information about you, including your User Information to learn more about your travel preferences. We and our partners also use these technologies to administer the Services; collect and store information such as user settings, anonymous browser identifiers; track user’s location; gather demographic information about our user base; visitor behavior, etc. We use this information to get a more accurate picture of customer travel interest.",
    "You can control the use of cookies at the individual browser level, but if you choose to disable cookies, it may limit your use of certain features or functions on the Services. ",
    "We use this information to get a more accurate picture of audience interests to provide updates we believe are more relevant to your interests. We store page views, clicks, and search terms used for ad personalization targeting separately from your Personal Information.",
  ];
  const content4 = [
    "Any relevant Third Party Service Providers such as our Destinations, Hotel, Activity Service Provider/s who provide the end services;",
    "legal and regulatory authorities, upon request, or to report any actual or suspected breach of applicable law or regulation;",
    "outside professional advisors (such as accountants, auditors, or lawyers), subject to binding contractual obligations of confidentiality;",
    "third party Processors (such as analytic providers; data centers; etc.), located anywhere in the world;",
    "any relevant party, law enforcement agency or court, to the extent necessary for the establishment, exercise or defense of legal rights;",
    "any relevant party for prevention, investigation, detection or prosecution of criminal offenses or the execution of criminal penalties, including safeguarding against and the prevention of threats to public security;",
    "any relevant third party acquirer(s), if we sell or transfer all or any relevant portion of our business or assets (including in the event of a reorganization, dissolution or liquidation);",
    "to third parties whose practices are not covered by this Privacy Policy (e.g., third party providers of goods and services, marketing and advertising companies and agencies, content publishers, and retailers).",
  ];

  return (
    <div className="TC flex flex-col min-h-full sm:px-6 sm:py-12 lg:px-8 h-[100vh] sm:h-auto pb-0">
      <div className="flex flex-1 flex-col px-6 pt-12 sm:mx-auto sm:w-full sm:max-w-lg   sm:px-6 sm:py-12  lg:px-8 h-min-[100vh] sm:h-auto pb-0 justify-between">
        <div className=" ">
          {" "}
          <Link to="/">
            <BackButton />
          </Link>
          <div className="flex justify-between items-center">
            <h2 className="mt-10 mb-[2rem] text-left w-full text-4xl leading-9 tracking-tight text-primary-orange">
              Privacy Policy
            </h2>
          </div>
          <div className="my-3 flex flex-col gap-[30px]">
            <div className="ml-[1.5rem]">
              <div className="mb-3 text-[12px]">
                “All credit/debit cards details and personally identifiable
                information will NOT be stored, sold, shared, rented or leased
                to any third parties”.
                <br />
                Privacy is important to us, and we value that trust for letting
                your information shared with us. We are committed to protecting
                and safeguarding any personal data you give to us and we act in
                our customers' interest and are transparent about the processing
                of your data.
              </div>
              <div className="mb-3 text-[12px]">
                This Privacy Statement applies to any kind of information we
                collect through these platforms or other means connected to
                these platforms. It also explains how we may process your
                information.{" "}
              </div>
              <div className="mb-3 text-[12px]">
                This Policy may be amended or updated from time to time, so
                please check it regularly for updates.
              </div>

              <div className="mb-3 text-[15px]">TERMS AND CONDITIONS:</div>
              <div className="mb-3 text-[15px]">
                WHAT INFORMATION WE MAY PROCESS?
              </div>
              <div className="mb-3 text-[12px]">
                On your accessing of the Platform, we may process the following
                categories of information about you, such as:
              </div>
              <ul>
                {termsConditions.map((tc, i) => (
                  <li
                    style={{
                      listStyle: "disc",
                    }}
                    className="text-black mb-4 text-[12px] text-left"
                    key={i}
                    dangerouslySetInnerHTML={{ __html: tc }}
                  />
                ))}
              </ul>
              <div className="mb-3 text-[12px]">
                We also collect other kinds of information from you or other
                sources, which we refer to as “Other Information” in this
                Policy, which may include but is not limited to:
              </div>
              <ul>
                {content2.map((tc, i) => (
                  <li
                    style={{
                      listStyle: "disc",
                    }}
                    className="text-black mb-4 text-[12px] text-left"
                    key={i}
                    dangerouslySetInnerHTML={{ __html: tc }}
                  />
                ))}
              </ul>
              <div className="mb-3 text-[15px]">
                SENSITIVE PERSONAL INFORMATION
              </div>
              <div className="mb-3 text-[12px]">
                We do not seek to collect or otherwise process your sensitive
                personal information. In case we are constrained to process your
                personal sensitive information, we will process the same to be
                extent reasonably and legally permissible. The Services are not
                intended for use by any children below 18 years of age unless
                otherwise parental consent is provided.
              </div>
              <div className="mb-3 text-[15px]">
                HOW WE COLLECT INFORMATION?
              </div>
              <div className="mb-3 text-[12px]">
                We may collect or obtain User Information about you eithbut er
                directly from you or in the course of our relationship with you.
                For example: when you make your Information public (e.g., if you
                make a public post about us on social media); when you download,
                install or use any of our Services; we may also receive User
                Information about you from third parties (e.g., our affiliate
                partners.); and we may also create User Information about you,
                such as records of your interactions with us. Tanweer Festival
                is not responsible for Personal Information you volunteer about
                yourself in public areas of the Services. This Policy does not
                cover the practices of third parties who may provide information
                about you to the Tanweer Festival.
              </div>
              <div className="mb-3 text-[15px]">
                PURPOSES FOR WHICH WE MAY PROCESS YOUR INFORMATION
              </div>
              <div className="mb-3 text-[12px]">
                We may Process User Information for following purposes:
                providing the Services to you; communicating with you; providing
                advertising to you on the Services and Channels; Lead
                generation; analyzing your travel interest; observing user
                engagement and booking travel activities across Services and
                Channels; conducting surveys; managing our IT systems i.e.
                identification and mitigation of fraudulent activity; compliance
                with applicable law; and improving our Services.
              </div>
              <div className="mb-3 text-[15px]">DIRECT MARKETING</div>
              <div className="mb-3 text-[12px]">
                We may Process your User Information to contact you via email,
                telephone, SMS, or other methods of communication to provide you
                with information regarding our Services that may be of interest
                to you. We may send information to you regarding our Services,
                travel offers; upcoming promotions that may be of interest to
                you, using the contact details that you have provided to us, and
                always in compliance with applicable law.
              </div>
              <div className="mb-3 text-[15px]">
                COOKIES, SIMILAR TECHNOLOGIES, AND ONLINE BEHAVIORAL ADVERTISING
              </div>
              <ul>
                {content3.map((tc, i) => (
                  <li
                    style={{
                      listStyle: "disc",
                    }}
                    className="text-black mb-4 text-[12px] text-left"
                    key={i}
                    dangerouslySetInnerHTML={{ __html: tc }}
                  />
                ))}
              </ul>
              <div className="mb-3 text-[15px]">
                WHAT INFORMATION WE DISCLOSE TO THIRD PARTIES
              </div>
              <div className="mb-3 text-[12px]">
                We may disclose your User Information to other entities within
                the Company group, for legitimate business purposes (including
                operating the Services and providing services to you), in
                accordance with applicable law. Also, we may disclose your User
                Information to:
              </div>
              <ul>
                {content4.map((tc, i) => (
                  <li
                    style={{
                      listStyle: "disc",
                    }}
                    className="text-black mb-4 text-[12px] text-left"
                    key={i}
                    dangerouslySetInnerHTML={{ __html: tc }}
                  />
                ))}
              </ul>
              <div className="mb-3 text-[12px]">
                Tanweer Festival may use third-party advertising service
                companies for online behavioral advertising (“OBA”) or
                otherwise, and perform related services when you use our
                Services. These third-party advertising companies employ cookies
                and other technologies to measure the effectiveness of the
                website, app, and to understand the booking behavior of the
                User. We also engage third party providers to assist with the
                segmentation of this data.
              </div>
              <div className="mb-3 text-[12px]">
                We may engage third party providers to assist with the
                collection, storage, and segmentation of Online Data, and the
                providers are required to maintain the confidentiality of this
                information. These third-party providers may collect User
                Information from our Services for their purposes, including but
                not limited to monitoring fraud around the web.
              </div>
              <div className="mb-3 text-[12px]">
                We may share your User Information with our partners such as
                your name, email, or other identifiers. Our partners may also:
                (i) collect information directly from your device, such as your
                IP address, device ID, advertising ID, and information about
                your browser or operating system; (ii) combine User Information
                about you received from us with information about you from other
                sites or services; and (iii) place or recognize a unique cookie
                on your browser.
              </div>
              <div className="mb-3 text-[15px]">DATA SECURITY</div>
              <div className="mb-3 text-[12px]">
                We have implemented reasonable technical and organizational
                security measures to protect your User Information. Please
                ensure that any Personal Information that you send to us is sent
                securely. However, we cannot guarantee there will not be a
                breach, and we are not responsible for any breach of security or
                the actions of any third parties.
              </div>
              <div className="mb-3 text-[12px]">
                Because the internet is an open system, the transmission of
                information via the internet is not completely secure. Although
                we will implement reasonable measures to protect your
                information, we cannot guarantee the security of your data
                transmitted to us using the internet. Any such transmission is
                at your own risk and you are responsible for ensuring that any
                Personal Information that you send to us are sent securely.
              </div>
              <div className="mb-3 text-[15px]">DATA RETENTION</div>
              <div className="mb-3 text-[12px]">
                We take every reasonable step to ensure that your User
                Information is only retained as long as they are needed.{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
