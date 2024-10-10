import { useEffect } from "react";
import { Link } from "../../node_modules/react-router-dom/dist/index";
import BackButton from "../components/BackButton";
import { title } from "../constants/index";

export default function TC() {
  useEffect(() => {
    window.analytics.page();
    document.title = `Terms & Conditions - ${title}`;
  }, []);
  const termsConditions = [
    "<span style='font-weight: bolder; font-size: larger'>Refund Policy and Ticket Assignment.</span> All sales are final. Except as may be outlined in these terms and conditions, no refund, no exchange and no cancellation permitted. Purchased Tickets are not assignable, transferable, or re-saleable to any third party.",    
    "<span style='font-weight: bolder; font-size: larger'>Method of Payment:</span> Seller accepts online payments in AED using Visa and Mastercard credit or debit cards.",
    "Purchaser shall be allowed re-entry if Purchaser wishes to leave and come back on the event date or take a break during the event.",
    "Purchased Tickets are not replaceable. Purchaser shall be responsible for the safe keeping of the Purchased Ticket. Seller shall not be responsible for lost, stolen damaged, destroyed Purchased Ticket.",
    "<span style='font-weight: bolder; font-size: larger'>Wheelchair Accessibility.</span> Tanweer Festival is not wheelchair accessible. Due to the natural terrain and the specific layout of the Festival site, Seller is unable to accommodate wheelchair access. By purchasing a ticket, Purchaser acknowledges and accepts that the Festival will not provide the necessarily facilities for wheelchair users to fully access the event. The Purchaser agrees that Tanweer Festival LLC – SP shall not be held liable for any inability to access or fully participate in the event due to the lack of wheelchair accessibility. The Purchaser fully understands and consents to this limitation prior to purchasing a ticket.",
    "<span style='font-weight: bolder; font-size: larger'>Unauthorized resellers.</span> Seller reserves the right to cancel any Purchased Tickets procured from unauthorized resellers (including but not limited to Dubizzle, Facebook Marketplace, and other resellers). Any such Purchased Tickets bought from unauthorized resellers are not valid for entry. Tanweer Festival and Platinumlist are the only authorized ticket sellers.",
    "If an event is postponed or rescheduled, Purchaser shall be entitled to either request a full refund of the price received by the Seller for the Purchased Tickets OR choose to retain the Purchased Tickets to be used for the rescheduled date. Purchased Tickets will be honored for the rescheduled date. New tickets generally will not need to be issued; in the rare case that new tickets are needed, Purchaser will be contacted by the Seller.",
    "If the event is canceled, Purchaser’s sole and only entitlement will be a full refund of the price received by the Seller from the Ticket Purchaser, excluding any shipping and handling charges. Seller shall not be liable for, and Ticket Purchaser shall not be entitled to, any compensation for any loss or damage beyond the refund of the ticket price. Refunds will be processed in the same currency as the original order.",
    "Purchased Tickets shall be valid only for the zone identified on the Purchased Ticket. Seller guarantees that Purchased Tickets will allow access to the zone listed on the Purchased Ticket.",
    "<span style='font-weight: bolder; font-size: larger'>Personal Information.</span> Purchaser shall be responsible for any errors made when entering their information, errors may result in issues such as a delay in processing the order or in delivery of tickets or in cancellation of order.",
    "<span style='font-weight: bolder; font-size: larger'>Pricing.</span> All prices are in United Arab Emirates Dirhams (AED) unless otherwise specifically stated.",
    "<span style='font-weight: bolder; font-size: larger'>Taxes and Additional Charges.</span> Seller will charge Purchaser any taxes applicable to the sale of the Purchased Ticket and additional fee for card or any other form of digital payment.",
    "<span style='font-weight: bolder; font-size: larger'>Third-Party Payment Platforms (Paypal, Apple Pay, etc.).</span> If Purchaser selects to complete a transaction via a third-party payment platform, such third-party services may be subject to separate policies, terms of use, and/or fees of said third parties and Purchaser accepts the same by completing the transaction using the third-party payment platform. If a third party provider error, system error, or other payment processing error or problem of any kind results in an unprocessed payment and therefore Purchaser’s payment card is not charged the total amount due even though the Purchased Ticket was issued to Purchaser, Seller shall have the right, at its sole discretion, to either collect the amount of the total amount due from the Purchaser or cancel the Purchased Ticket.",
    "<span style='font-weight: bolder; font-size: larger'>Purchaser Behavior Policy. </span> The Purchaser shall abide by all rules and policies of the venue where the event is located relating to conduct and behavior.  Seller shall have the right to eject or deny entry to Purchaser or holder of Purchased Ticket from the event for failure to abide by the venue's rules and policies. Purchaser shall be liable to Seller for all reasonable costs, expenses, and losses associated with any loss, including but not limited to all direct and indirect damages, including lost profits arising from such failure by Purchaser to abide by the venue's rules and policies.",
    "<span style='font-weight: bolder; font-size: larger'>Photography and Media:</span> By attending Tanweer Festival, the Purchaser consents to and grants the use of any photographs, videos, or recordings taken on site which captures their image, likeness, or voice to the event organiser. The Purchaser agrees that these photographs, videos, or recordings may be used, reproduced, or distributed by Tanweer Festival for promotional, marketing, advertising, or educational purposes in any media, including but not limited to social media, websites, printed materials, and online advertising. The Purchaser further acknowledges that they will not receive any form of compensation for the use of his/her image, likeness, or voice as captured during the event. This consent is perpetual, meaning the images, likenesses, or recordings may be used indefinitely.",
    "<span style='font-weight: bolder; font-size: larger'>Prohibition.</span> Purchaser understands and agrees that no alcohol, of any kind or type, shall be consumed, possessed, or distributed during the event. Any violation of this alcohol prohibition may result in immediate ejection from the event without any entitlement to any refund.",
    "<span style='font-weight: bolder; font-size: larger'>Safety.</span> Purchaser acknowledges and agrees to assume full responsibility for their own safety and well-being during the event. Purchaser acknowledges that camping in the desert presents inherent risks and challenges, including, but not limited to, extreme weather conditions, wildlife encounters, uneven terrain, and limited access to emergency services. Purchaser hereby acknowledges that they have a duty to make themselves fully aware of all circumstances and risks associated with desert camping, and to take all necessary precautions to minimize these risks. This includes, but is not limited to, staying informed about weather conditions, staying hydrated, and carrying appropriate clothing and equipment. Purchaser further agrees to abide by and follow any instructions, guidelines, or directions provided by the event organizers or their designated representatives. These instructions may relate to safety measures, campsite rules, or emergency procedures. Failure to comply with such instructions may put Purchaser and their safety at serious risks and will result in the Purchaser being asked to leave the event without any right to a refund. Purchaser understands that participating in the event is entirely voluntary, and they assume all risks associated with their participation. Purchaser also acknowledges that they are solely responsible for any costs associated with medical treatment or evacuation in the event of illness, injury, or other emergencies that may occur during the Event. By purchasing a ticket to the event, Purchaser acknowledges that they have read and understood this clause, and they voluntarily accept all risks associated with desert camping and the event.",
    "No outside food or beverages, professional cameras, drones, dangerous substances, recording devices, BBQ equipment or tools, or any other equipment or material shall be allowed on the event premises unless expressly permitted by the Seller. All refillable drinking bottles must be empty upon entry.",
    "Other than in areas where they are clearly identified as being permitted, BBQs, fire pits and open flames of any kind are strictly prohibited at all areas of Tanweer Festival, including on all areas of the festival site, in the glamping grounds and in the self-camping areas.",
    "In accordance with the Mleiha National Park Emiri Decree No. (16) of 2024, the following activities are strictly prohibited and will be strictly enforced:",
    "(a) Hunting, transporting or taking any organisms or organic materials;",
    "(b) Damaging or destroying geological or geographic formations or areas that are shelter to animal or plant species or for their reproduction, this includes scaling or climbing of geographical rock formations;",
    "(c) Pollution of soil, water or air, this includes littering and dumping of any kind;",
    "(d) Cutting or destroying trees or plants or eroding the soil; and",
    "(e) Causing harm to any animal life, plant life, geological formations or any natural resources of any kind.",
    "Off-roading in the surrounding desert area is strictly prohibited other than through pre-approved designated operators.",
    "Attendees must be at least 18 years old. Individuals aged 17 and under are not permitted at the venue for safety reasons. Seller reserves the right to ask to see an acceptable form of proof of identity to verify age. The following are an acceptable form of proof of identity: original government issued photo ID, original passport or the ICP UAE App.",
    "<span style='font-weight: bolder; font-size: larger'>Fraudulent Use.</span> To protect Purchaser from fraud, Purchaser may be required to provide additional proof of identify on any order. The following are an acceptable form of proof of identity: original government issued photo ID, original passport or the ICP UAE App.",
    "After placing an order, Purchaser will receive an email with the QR code of the bar code of the Purchased Ticket; therefore, it is important that Purchaser provides an accurate email address during the order process.",
    "Seller reserves the right to add, withdraw, reschedule or substitute artists and/or vary advertised programs, prices, seating arrangements, and audience capacity without prior notice.",
    "<span style='font-weight: bolder; font-size: larger'>Vehicle Parking.</span> Purchaser acknowledges and agrees that any vehicle parked at the event site, whether in designated parking areas or elsewhere, is parked at the owner’s risk. The Seller shall not be responsible for any loss, damage, theft, or harm to vehicles, their contents, or any personal property left therein. This includes, but is not limited to, damage caused by other vehicles, natural elements, vandalism, or theft. Purchaser hereby waives any claims against Seller for any loss or damage to their vehicle or belongings contained within while parked at the event site, to the extent permitted by applicable law.",
    "Seller may collect and use Purchaser’s personal information, limited to name, contact details and transactional history, for transactional purposes, including those related to customer service for the transaction and to market the products and services of the Seller. Purchaser shall have the right to opt out of and stop receiving promotional or marketing communication from Seller by notifying the Seller in writing or via the opt-out link provided in the communication or through any other method provided by the Seller.",
    "<span style='font-weight: bolder; font-size: larger'>Governing Law.</span> These terms and conditions, including the below arbitration clause, and any transaction concluded according herewith will be governed by the laws of the Emirate of Sharjah and any applicable federal laws of the United Arab Emirates without regard to its conflict of law provisions.",
    "<span style='font-weight: bolder; font-size: larger'>Jurisdiction.</span> Any controversy, dispute or claim arising out of or relating to these terms and conditions, or any transaction concluded hereunder, shall be finally settled under the Rules of Arbitration of the Sharjah International Commercial Arbitration Center (TAHKEEM) by one arbitrator appointed in accordance with the said Rules. Arbitration shall be seated in Sharjah, United Arab Emirates. Arbitration shall proceed in English.",
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
              Terms and Conditions
            </h2>
          </div>
          <div className="my-3 flex flex-col gap-[30px]">
            <div className="ml-[1.5rem]">
              <div className="mb-3 text-[12px]">
              The following are the binding terms and conditions of the direct ticket sale between Tanweer Festival LLC - SP (the <span style={{fontWeight: 'bolder', fontSize: 'larger'}}>“Seller”</span>) and
                purchaser (the <span style={{fontWeight: 'bolder', fontSize: 'larger'}}>“Purchaser”</span>) of the event ticket (the <span style={{fontWeight: 'bolder', fontSize: 'larger'}}>“Purchased
                Ticket”</span>).
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
