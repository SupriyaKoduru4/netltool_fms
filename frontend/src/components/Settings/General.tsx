import Button from "../UI/Button";

function GeneralSettings() {

  return (
    <div className=" border border-gray-300 rounded-md p-4" >

      <h2 className="text-xl text-black font-bold mb-6">
        General Settings
      </h2>

      <div className="flex flex-col gap-5">

        <div>
          <label className="font-semibold text-m text-black">
            Organization Name
          </label>

          <input
            type="text"
            defaultValue="Netltool_FMS"
            className=" w-full border border-gray-300 rounded-md px-4 py-3 mt-2 outline-none"
          />

        </div>

        <div>

          <label className="font-semibold text-m text-black">
            Language
          </label>

          <select
            className=" w-full border border-gray-300 rounded-md px-4 py-3 mt-2 outline-none" >

            <option>
              English
            </option>

            <option>
              Telugu
            </option>

             <option>
              Hindi
            </option>

          </select>

        </div>

        <div>
          <label className="font-semibold text-m text-black">
            Timezone
          </label>

          <select
            className=" w-full border border-gray-300 rounded-md px-4 py-3 mt-2 outline-none">

            <option>
              (GMT+05:30) India Standard Time
            </option>

          </select>

        </div>
      </div>

      <div className="flex justify-end mt-6">
        <Button
          text="Save Changes"
          variant="primary"
        />

      </div>

    </div>
  );
}

export default GeneralSettings;