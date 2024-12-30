
import { Footer } from "flowbite-react"
import { Link } from "react-router-dom"
import { FaFacebook, FaLinkedin, FaTwitter } from "react-icons/fa";

export default function FooterCom() {
  return (

      <div className="w-full mx-auto p-2">
       <div className="flex gap-4 justify-start mt-4">
        <Footer.Icon href="#" icon={FaFacebook} />
        <Footer.Icon href="#" icon={FaLinkedin} />
        <Footer.Icon href="#" icon={FaTwitter} />
       </div>
        <div className="mt-5">
       <Link to='/' 
        className="self-center whitespace-nowrap sm:text-xl font-semibold">
       Coder XYZ
        </Link>
       </div>

        <div className="text-xs mt-2">
         <Footer.LinkGroup row>

         <Footer.Link
         href='/about'
         target="_blank"
         rel='noopener noreferrer'
         >
           About
         </Footer.Link>

         <Footer.Link
         href='/about'
         target="_blank"
         rel='noopener noreferrer'
         >
           Privacy
         </Footer.Link>

         <Footer.Link
         href='/about'
         target="_blank"
         rel='noopener noreferrer'
         >
           Terms
         </Footer.Link>

         <Footer.Link
         href='/about'
         target="_blank"
         rel='noopener noreferrer'
         >
           Teams
         </Footer.Link>
         </Footer.LinkGroup>
        </div>
  

       <div className="w-full sm:flex sm:items-center sm:justify-between mt-2">
        <Footer.Copyright href='#' by='Coder XYZ' year={new Date().getFullYear()} />
  
       </div>
       </div>


  )
}
