import { Typography } from "antd";
import BreadCrumb from "../../utils/bread-crumbs";
import { useLocation } from "react-router-dom";
import { CustomButton, CustomInput } from "../../utils/custom-input";

function CreateInstance() {
  const path = useLocation().pathname;
  return (
    <>
      <div className="flex justify-between items-center mb-5 ">
        <div className="flex flex-col gap-1">
          <h1 className="text-[24px] font-semibold text-[#101828]">
            Create Instance
          </h1>

          <BreadCrumb pathname={path} />
        </div>
      </div>
      <div className="p-4">
        <div className="flex flex-col gap-2">
          <div className="flex gap-5 mb-4">
            <div className="w-1/2">
              <Typography className="text-[14px] font-inter text-gray-600 font-medium mb-1">
                Instance Name
              </Typography>
              <CustomInput
                placeHolder="Enter instance name"
                className="h-[40px]"
              />
            </div>
            <div className="w-1/2">
              <Typography className="text-[14px] font-inter text-gray-600 font-medium mb-1">
                Project
              </Typography>
              <CustomInput
                placeHolder="Enter instance name"
                className="h-[40px]"
              />
            </div>
          </div>
          <div className="flex gap-5 mb-4">
            <div className="w-1/2">
              <Typography className="text-[14px] font-inter text-gray-600 font-medium mb-1">
                Flavor
              </Typography>
              <CustomInput
                placeHolder="Enter instance name"
                className="h-[40px]"
              />
            </div>
            <div className="w-1/2">
              <Typography className="text-[14px] font-inter text-gray-600 font-medium mb-1">
                Network
              </Typography>
              <CustomInput
                placeHolder="Enter instance name"
                className="h-[40px]"
              />
            </div>
          </div>
          <div className="flex gap-5 mb-4">
            <div className="w-1/2">
              <Typography className="text-[14px] font-inter text-gray-600 font-medium mb-1">
                Image OS
              </Typography>
              <CustomInput
                placeHolder="Enter instance name"
                className="h-[40px]"
              />
            </div>
            <div className="w-1/2">
              <Typography className="text-[14px] font-inter text-gray-600 font-medium mb-1">
                Keypair
              </Typography>
              <CustomInput
                placeHolder="Enter instance name"
                className="h-[40px]"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-5">
          <CustomButton label="Create Instance" />
        </div>
      </div>
    </>
  );
}

export default CreateInstance;
