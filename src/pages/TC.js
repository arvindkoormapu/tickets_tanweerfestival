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
    "All sales are final. No refund, no exchange and no cancellation permitted.",
    "Purchased Tickets are not assignable, transferable or re-salable to any third party.",
    "Purchaser shall be allowed re-entry if Purchaser wishes to leave and come back on the event date or take a break during the event.",
    "Purchased Tickets are not replaceable. Purchaser shall be responsible for the safe keeping of the Purchased Ticket. Seller shall not be responsible for lost, stolen damaged, destroyed Purchased Ticket.",
    "If an event is postponed or rescheduled, Purchased Ticket will be honored for the rescheduled date. New tickets generally will not need to be issued; in the rare case that new tickets are needed, Purchaser will be contacted by the Seller.",
    "If the event is cancelled, Purchaser sole and only entitlement will be a full refund of the price received by the Seller from the Ticket Purchaser. Seller shall not be liable for and Ticket Purchaser shall not be entitled to any compensation for any loss or damage. Any shipping and handling charges are not refundable. Refunds will be processed in the same currency as the original order.",
    "Purchaser shall be responsible for any errors made when entering their information, errors may result in issues such as a delay in processing the order or in delivery of tickets or in cancellation of order.",
    "Purchased Tickets shall be valid only for the place (seat and zone) ordered by the Purchaser. Seller guarantee that Purchased Ticket will be within the place listed on the Purchased Ticket. In the very unlikely event if the same place is listed on two different Purchased Tickets for two different Purchasers, Seller will arrange one comparable or better place for the recent Purchaser.",
    "Pricing All prices are in United Arab Emirates Dirhams (AED) unless otherwise specifically stated.",
    "Taxes and Additional Charges. Seller will charge Purchaser any taxes applicable to the sale of the Purchased Ticket and additional fee for card or any other form of digital payment.",
    "Third Party Payment Platforms (Paypal, Apple Pay, etc.). If Purchaser selects to complete a transaction a Third Party Payment Platform, such third party services may be subject to separate policies, terms of use, and or fees of said third parties and Purchaser accepts the same by completing the transaction using the Third Party Payment Platform. If a third party provider error, system error, or other payment processing error or problem of any kind results in an unprocessed payment and therefore Purchaser’s payment card is not charged the total amount due even though the Purchased Ticket was issued to Purchaser, Seller shall have the right, at its sole discretion, to either collect the amount of the total amount due from the Purchaser or cancel the Purchased Ticket.",
    "Purchaser Behavior Policy. The Purchaser shall abide by all rules and policies of the venue where the event is located relating to conduct and behavior.  Seller shall have the right to eject or deny entry to Purchaser or holder of Purchased Ticket from the event for failure to abide by the venue's rules and policies. Purchaser shall be liable to Seller for all reasonable costs, expenses, and losses associated with any loss, including but not limited to all direct and indirect, damages, including lost profits arising from such failure by Purchaser to abide by the venue's rules and policies.",
    "Prohibition. Purchaser understands and agrees that no alcohol, of any kind or type, shall be consumed, possessed, or distributed during the event. Any violation of this alcohol prohibition may result in immediate ejection from the event without any entitlement to any refund.",
    "Purchaser acknowledges and agrees to assume full responsibility for their own safety and well-being during the event. Purchaser acknowledges that camping in the desert presents inherent risks and challenges, including, but not limited to, extreme weather conditions, wildlife encounters, uneven terrain, and limited access to emergency services. Purchaser hereby acknowledges that they have a duty to make themselves fully aware of all circumstances and risks associated with desert camping, and to take all necessary precautions to minimize these risks. This includes, but is not limited to, staying informed about weather conditions, staying hydrated, and carrying appropriate clothing and equipment. Purchaser further agrees to abide by and follow any instructions, guidelines, or directions provided by the event organizers or their designated representatives. These instructions may relate to safety measures, campsite rules, or emergency procedures. Failure to comply with such instructions may put Purchaser and their safety at serious risks and will result in the Purchaser being asked to leave the event without any right to a refund. Purchaser understands that participating in the event is entirely voluntary, and they assume all risks associated with their participation. Purchaser also acknowledges that they are solely responsible for any costs associated with medical treatment or evacuation in the event of illness, injury, or other emergencies that may occur during the Event. By purchasing a ticket to the event, Purchaser acknowledges that they have read and understood this clause, and they voluntarily accept all risks associated with desert camping and the event.",
    "No food, beverage, empty bottles, cameras, drones, BBQ equipment or tools, or any other equipment or material shall be allowed on the event premises unless expressly permitted by the Seller.",
    "Minimum age allowed to the event shall be 9 years. Minors (aged 9 to 18) must be accompanied by a responsible adult throughout the duration of the event. The accompanying adult must assume full responsibility for the minor's safety, well-being, and compliance with all event rules and guidelines. The Seller reserves the right to verify the age of all participants.",
    "Fraudulent Use To protect Purchaser from fraud, Purchaser may be required to provide additional proof of identify on any order. Proof of identity may include but is not limited to a signed credit card authorization and/or photocopies of government issued photo ID.",
    "After placing an order, Purchaser will receive an email with the QR code of the Bar Code of the Purchased Ticket; therefore, it is important that Purchaser provides accurate email address during the order process.",
    "Governing Law. These terms and conditions, including the below arbitration clause, and any transaction concluded according herewith will be governed by the Law of the United Arab Emirates without regard to its conflict of law provisions.",
    "Jurisdiction. Any controversy, dispute or claim arising out of or relating to these terms and conditions or any transaction concluded hereunder shall be finally settled under the Rules of Arbitration of the Sharjah International Commercial Arbitration Center (TAHKEEM) by one arbitrator appointed in accordance with the said Rules. Arbitration shall be seated in Sharjah. Arbitration shall proceed in English.",
    "Seller may collect and use Purchaser’s personal information for transactional purposes, including those related to customer service for the transaction and to market the products and services of the Seller. Purchaser shall, at all times, have the right to opt out of and stop receiving promotional or marketing communication from Seller.",
  ];
  return (
    <div className="TC flex flex-col min-h-full sm:px-6 sm:py-12 lg:px-8 h-[100vh] sm:h-auto pb-0">
      <div className="flex flex-1 flex-col px-6 pt-12 sm:mx-auto sm:w-full sm:max-w-lg   sm:px-6 sm:py-12  lg:px-8 h-min-[100vh] sm:h-auto pb-0 justify-between">
        <div className=" ">
          {" "}
          <Link to="/signup">
            <BackButton />
          </Link>
          <div className="flex justify-between items-center">
            <h2 className="mt-10 mb-[2rem] text-left w-full text-4xl leading-9 tracking-tight text-primary-orange">
              Terms and Conditions
            </h2>
          </div>
          <div className="my-3 flex flex-col gap-[30px]">
            <div className="ml-[1.5rem]">
              <ul>
                {termsConditions.map((tc, i) => (
                  <li
                    style={{
                      listStyle: "disc",
                    }}
                    className="text-black mb-4 text-[15px] text-left"
                    key={i}
                  >
                    {tc}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
