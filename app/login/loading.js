import {Spinner} from "@heroui/spinner";

export default function Loading() {
  return (
    <div className="flex flex-col gap-3 items-center bg-[#101828] text-white justify-center h-screen">
              <Spinner classNames = {{
                  circle1: "text-gray-400",  // حلقه اول
                  circle2: "text-orange-500",  // حلقه دوم
                  wrapper: "text-[#001122]"     // wrapper
                }}variant = 'simple' size="lg"  /> 
                <p>در حال بار گذاری ...</p>
    
        
    </div>
  )
}
