import { GetInTouch } from "@/components";
import { marcellus, raleway } from "@/config/fonts";
import { faEnvelope, faLocationArrow, faPhoneAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ContactPage() {
    return (
        <div className="grid">
            <div className="title-all">
                <h1 className={`${marcellus.className} text-center text-[26px] md:text-5xl`}>
                    Contact
                </h1>
            </div>
            <iframe 
                style={{width: '100%', height: '332px'}} 
                loading="lazy" src="https://maps.google.com/maps?q=Lewisburg%2C%20TN&amp;t=m&amp;z=10&amp;output=embed&amp;iwloc=near" 
                title="Lewisburg, TN" 
                aria-label="Lewisburg, TN"
                >
            </iframe>
            <div className="mx-auto my-12 w-10/12 grid grid-flow-row md:grid-flow-col gap-8 place-items-center contact py-0 md:py-8">
                    <div className="grid md:flex gap-4">
                        <div className="flex place-content-center">
                            <FontAwesomeIcon size="4x" className="text-golden-sand" icon={faLocationArrow} />
                        </div>
                        <div className="text-center md:text-left">
                            <h4 className={`${marcellus.className} font-bold info`}>LOCATION</h4>
                            <p className={`${raleway.className} text-sm`}>Lewisburg, TN</p>
                        </div>
                    </div>
                    <div className="grid md:flex gap-4">
                        <div className="flex place-content-center">
                            <FontAwesomeIcon size="4x" className="text-golden-sand" icon={faPhoneAlt} />
                        </div>
                        <div className="text-center md:text-left">
                            <h4 className={`${marcellus.className} font-bold info`}>PHONE</h4>
                            <p className={`${raleway.className} text-sm`}>931-224-2968</p>
                        </div>
                    </div>
                    <div className="grid md:flex gap-4">
                        <div className="flex place-content-center">
                            <FontAwesomeIcon size="4x" className="text-golden-sand" icon={faEnvelope} />
                        </div>
                        <div className="text-center md:text-left">
                            <h4 className={`${marcellus.className} font-bold info`}>EMAIL</h4>
                            <p className={`${raleway.className} text-sm`}>justin@classichorseauction.com</p>
                        </div>
                    </div>
            </div>
            <div className="w-full contact-form">
            <GetInTouch isContact={true} />
            </div>
        </div>
    )
}