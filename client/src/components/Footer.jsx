
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
        <img src="https://firebasestorage.googleapis.com/v0/b/adhyatma-ce6a3.appspot.com/o/1735566563733_coderxyz.png?alt=media&token=aa59cda9-b542-469f-9a36-9c73c87502e2" className="w-28"  />
        </Link>
       </div>

        <div className="text-xs mt-2">
         <Footer.LinkGroup>

         <Footer.Link
         href='/about'
         rel='noopener noreferrer'
         >
           About
         </Footer.Link>

         <Footer.Link
         href='/privacy'
         rel='noopener noreferrer'
         >
           Privacy & Terms
         </Footer.Link>

         {/* <Footer.Link
         href='/teams'
         rel='noopener noreferrer'
         >
           Teams
         </Footer.Link> */}
         </Footer.LinkGroup>
        </div>
  

       <div className="w-full flex flex-row items-center justify-start mt-2">
       <Link to='/' 
        className="self-center whitespace-nowrap sm:text-xl font-semibold">
        <img src="https://firebasestorage.googleapis.com/v0/b/adhyatma-ce6a3.appspot.com/o/1735566563733_coderxyz.png?alt=media&token=aa59cda9-b542-469f-9a36-9c73c87502e2" className="w-16 pt-[2px]"  />
        </Link>&nbsp;
          <Footer.Copyright href='#' by='Coder XYZ' year={new Date().getFullYear()} className="text-xs" />
  
       </div>
       </div>


  )
}
