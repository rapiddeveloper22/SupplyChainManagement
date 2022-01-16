// SPDX-License-Identifier: MIT

pragma solidity ^0.6.12;

import "../node_modules/@openzeppelin/upgrades-core/contracts/Initializable.sol";

contract Supply is Initializable {
    //To store details about each Mobile
    struct Mobile {
        string ModelName;
        string ManufacturerName;
        string OwnerType;
        uint256 OwnerId;
        uint256 MobileId;
        uint256 IMEINumber;
    }
    Mobile[] mobile;

    //To store details about each Manufacturer
    struct Manufacturer {
        string ManufacturerName;
        string ManufacturerEmail;
        string ManufacturerPassword;
        uint256 ManufacturerId;
        address ManufacturerAddress;
    }
    Manufacturer[] manufacturer;

    //To store details about each User
    struct User {
        string UserName;
        string UserEmail;
        string UserPassword;
        uint256 UserId;
        address UserAddress;
    }
    User[] user;

    //To track the ownership of Mobiles
    struct Track {
        uint256 PreviousOwnerId;
        uint256 NewOwnerId;
        string NewOwnerType;
        string PreviousOwnerType;
    }

    //Keeps track of Ids of all manufacturers
    mapping(uint256 => address) ManufacturerIdToAddress;

    //Keeps track of Ids of all users
    mapping(uint256 => address) UserIdToAddress;

    //Keeps track of Ids of mobile using IMEI number
    mapping(uint256 => uint256) IMEIToMobileId;

    //To track an individual mobile
    Track[] track;
    mapping(uint256 => Track[]) public MobileIdToTrack;

    //Mapping for MobileId to Mobile data
    mapping(uint256 => Mobile[]) MobileIdToMobile;

    //Mapping for ManufacturerId to Manufacturer data
    mapping(uint256 => Manufacturer[]) ManufacturerIdToManufacturer;

    //Mapping for UserId to User data
    mapping(uint256 => User[]) UserIdToUser;

    //Variables for creaating Id
    uint256 MobileId;
    uint256 ManufacturerId;
    uint256 UserId;
    uint256 RetrieveManufacturerId;
    uint256 RetrieveUserId;
    bool login;

    //Initializing variables
    function initialize() public initializer {
        MobileId = 0;
        ManufacturerId = 0;
        UserId = 0;
        RetrieveManufacturerId = 0;
        RetrieveUserId = 0;
        login = true;
    }

    //Modifier to check whether a manufacturer
    // modifier OnlyManufacturer(uint256 _ManufacturerId) {
    //     require(msg.sender == ManufacturerAddresses[_ManufacturerId]);
    //     _;
    // }

    // //Modifier to check whether a user
    // modifier OnlyUser(uint256 _UserId) {
    //     require(msg.sender == UserAddresses[_UserId]);
    //     _;
    // }

    //Funtion to add Mobiles
    function AddMobile(
        string memory _ModelName,
        string memory _ManufacturerName,
        string memory _OwnerType,
        uint256 _OwnerId,
        uint256 _IMEINumber
    ) public {
        require(
            ManufacturerIdToAddress[_OwnerId] == msg.sender,
            "You are not a Manufacturer"
        );
        mobile.push(
            Mobile(
                _ModelName,
                _ManufacturerName,
                _OwnerType,
                _OwnerId,
                MobileId,
                _IMEINumber
            )
        );
        MobileIdToMobile[MobileId] = mobile;
        IMEIToMobileId[_IMEINumber] = mobile[MobileId].MobileId;
        MobileId++;
    }

    //Function to get id of mobile using IMEI number
    function GetIdOfMobile(uint256 _IMEINumber) public view returns (uint256) {
        return IMEIToMobileId[_IMEINumber];
    }

    //Funtion to add Manufacturer
    function AddManufacturer(
        string memory _ManufacturerName,
        string memory _ManufacturerEmail,
        string memory _ManufacturerPassword
    ) public {
        manufacturer.push(
            Manufacturer(
                _ManufacturerName,
                _ManufacturerEmail,
                _ManufacturerPassword,
                ManufacturerId,
                msg.sender
            )
        );
        RetrieveManufacturerId = ManufacturerId;
        ManufacturerIdToManufacturer[ManufacturerId] = manufacturer;
        ManufacturerIdToAddress[ManufacturerId] = msg.sender;
        ManufacturerId++;
    }

    //Function to get id of manufacturer using address
    function GetIdOfManufacturer() public view returns (uint256) {
        return RetrieveManufacturerId;
    }

    //Funtion to add User
    function AddUser(
        string memory _UserName,
        string memory _UserEmail,
        string memory _UserPassword
    ) public {
        user.push(
            User(_UserName, _UserEmail, _UserPassword, UserId, msg.sender)
        );
        RetrieveUserId = UserId;
        UserIdToUser[UserId] = user;
        UserIdToAddress[UserId] = msg.sender;
        UserId++;
    }

    //Function to get id of manufacturer using address
    function GetIdOfUser() public view returns (uint256) {
        return RetrieveUserId;
    }

    //Funtion to verify login credentials
    function VerifyLogin(
        string memory _Password,
        uint256 _id,
        string memory _Usertype
    ) public view returns (bool) {
        if (
            keccak256(abi.encodePacked((_Usertype))) ==
            keccak256(abi.encodePacked(("Manufacturer")))
        ) {
            if (
                keccak256(abi.encodePacked((_Password))) ==
                keccak256(
                    abi.encodePacked((manufacturer[_id].ManufacturerPassword))
                )
            ) {
                return true;
            }
        } else if (
            keccak256(abi.encodePacked((_Usertype))) ==
            keccak256(abi.encodePacked(("User")))
        ) {
            if (
                keccak256(abi.encodePacked((_Password))) ==
                keccak256(abi.encodePacked((user[_id].UserPassword)))
            ) {
                return true;
            }
        }

        return false;
    }

    //Funtion to transfer ownership from one user to another or from manufacturer to user
    function TransferOwnership(
        uint256 _PreviousOwnerId,
        uint256 _NewOwnerId,
        string memory _NewOwnerType,
        uint256 _MobileId,
        string memory _PreviousOwnerType
    ) public {
        MobileIdToTrack[_MobileId].push(
            Track(
                _PreviousOwnerId,
                _NewOwnerId,
                _NewOwnerType,
                _PreviousOwnerType
            )
        );
    }

    //Get the mobile owners
    function GetMobileOwnershipTracking(uint256 _MobileId, uint256 _OwnerNumber)
        public
        view
        returns (
            uint256,
            uint256,
            string memory,
            string memory
        )
    {
        return (
            MobileIdToTrack[_MobileId][_OwnerNumber].PreviousOwnerId,
            MobileIdToTrack[_MobileId][_OwnerNumber].NewOwnerId,
            MobileIdToTrack[_MobileId][_OwnerNumber].NewOwnerType,
            MobileIdToTrack[_MobileId][_OwnerNumber].PreviousOwnerType
        );
    }

    //Get Manufacturer details using Id
    function GetManufacturer(uint256 _ManufacturerId)
        public
        view
        returns (
            string memory,
            string memory,
            uint256
        )
    {
        return (
            ManufacturerIdToManufacturer[_ManufacturerId][_ManufacturerId]
                .ManufacturerName,
            ManufacturerIdToManufacturer[_ManufacturerId][_ManufacturerId]
                .ManufacturerEmail,
            ManufacturerIdToManufacturer[_ManufacturerId][_ManufacturerId]
                .ManufacturerId
        );
    }

    //Get User details using Id
    function GetUser(uint256 _UserId)
        public
        view
        returns (
            string memory,
            string memory,
            uint256
        )
    {
        return (
            UserIdToUser[_UserId][_UserId].UserName,
            UserIdToUser[_UserId][_UserId].UserEmail,
            UserIdToUser[_UserId][_UserId].UserId
        );
    }

    //Get Mobile details using Id
    function GetMobile(uint256 _MobileId)
        public
        view
        returns (
            string memory,
            string memory,
            string memory,
            uint256,
            uint256,
            uint256
        )
    {
        return (
            MobileIdToMobile[_MobileId][_MobileId].ModelName,
            MobileIdToMobile[_MobileId][_MobileId].ManufacturerName,
            MobileIdToMobile[_MobileId][_MobileId].OwnerType,
            MobileIdToMobile[_MobileId][_MobileId].OwnerId,
            MobileIdToMobile[_MobileId][_MobileId].MobileId,
            MobileIdToMobile[_MobileId][_MobileId].IMEINumber
        );
    }

    function GetTotalMobile() public view returns (uint256) {
        return MobileId;
    }

    function GetTotalUser() public view returns (uint256) {
        return UserId;
    }

    function GetTotalManufacturer() public view returns (uint256) {
        return ManufacturerId;
    }
}
