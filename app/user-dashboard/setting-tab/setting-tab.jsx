

export default function SettingsTab ({user}) {

    return(
            
  <div className="space-y-6">
    <h1 className="mb-6 font-bold text-2xl">تنظیمات حساب کاربری</h1>
    
    <div className="bg-gray-800/50 p-6 border border-gray-700 rounded-xl">
      <h2 className="mb-4 font-bold text-lg">اطلاعات شخصی</h2>
      <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
        <div>
          <label className="block mb-1 text-gray-400 text-sm">نام و نام خانوادگی</label>
          <input 
            type="text" 
            className="bg-gray-900 px-4 py-2 border border-gray-700 focus:border-blue-500 rounded-lg focus:outline-none w-full"
            defaultValue={user?.name || ""}
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-400 text-sm">ایمیل</label>
          <input 
            type="email" 
            className="bg-gray-900 px-4 py-2 border border-gray-700 focus:border-blue-500 rounded-lg focus:outline-none w-full"
            defaultValue={user?.email || ""}
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-400 text-sm">شماره تماس</label>
          <input 
            type="tel" 
            className="bg-gray-900 px-4 py-2 border border-gray-700 focus:border-blue-500 rounded-lg focus:outline-none w-full"
            defaultValue={""}
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-400 text-sm">تاریخ عضویت</label>
          <input 
            type="text" 
            className="bg-gray-900 px-4 py-2 border border-gray-700 rounded-lg focus:outline-none w-full"
            defaultValue={user?.createdAt || ""}
            disabled
          />
        </div>
      </div>
      
      <div className="mt-6 pt-6 border-gray-700 border-t">
        <h2 className="mb-4 font-bold text-lg">تنظیمات اعلان‌ها</h2>
        <div className="space-y-3">
          {[
            { label: 'اعلان‌های ایمیلی', checked: true },
            { label: 'اعلان‌های درون برنامه‌ای', checked: true },
            { label: 'اخبار و اطلاعیه‌ها', checked: false },
            { label: 'تخفیف‌های ویژه', checked: true },
          ].map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <span>{item.label}</span>
              <label className="inline-flex relative items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked={item.checked} />
                <div className="peer after:top-0.5 after:left-0.5 after:absolute bg-gray-700 after:bg-white peer-checked:bg-blue-600 rounded-full after:rounded-full peer-focus:outline-none w-11 after:w-5 h-6 after:h-5 after:content-[''] after:transition-all peer-checked:after:translate-x-full"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-6 pt-6 border-gray-700 border-t">
        <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-medium transition">
          ذخیره تغییرات
        </button>
      </div>
    </div>
  </div>
    )
}
