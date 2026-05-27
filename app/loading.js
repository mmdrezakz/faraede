import {Spinner} from "@heroui/spinner";

export default function Loading() {
  // sdsds
  return (
    <div className="flex flex-col text-white gap-3 items-center bg-[#101828] justify-center h-screen">
              <Spinner classNames = {{
                  circle1: "text-gray-400",  
                  circle2: "text-orange-500",  
                  wrapper: "text-[#001122]"     
                }}variant = 'simple' size="lg"  /> 
                <p>در حال بار گذاری ...</p>
    
        
    </div>
  )
}
