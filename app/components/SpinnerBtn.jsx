import {Spinner} from "@heroui/spinner";
import React from 'react'

export default function SpinnerBtn({children}) {
    return (
        <> 
        < Spinner classNames = {{
                  circle1: "text-gray-400",  // حلقه اول
                  circle2: "text-orange-500",  // حلقه دوم
                  wrapper: "text-[#001122]"     // wrapper
                }}variant = 'simple' size = 'sm' /> 
                <p>{children}</p>
    
        </>
    )
}
