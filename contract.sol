// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract certToken
{
// structure for data storage 
    struct user_token{
        string id; 
        bool exit;
    }

// mapping for data storage 

    mapping (string  => user_token)  alltoken;

    // function to add certficate 

    function addToken(string memory _id, string memory _token) public 
    {
     
        alltoken[_token] = user_token(_id,true);
    }

    //function to check if certificate exist 

     function isMappingObjectExists(string memory _token) public view returns (bool) {
       if (alltoken[_token].exit == true)
        {
            return true;
        }
        else{
            return false;
        }
     }
}
