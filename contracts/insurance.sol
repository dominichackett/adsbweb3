// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;
/**
 * @title FlightInsurance Contract
 * @dev Contract to provide flight delay or cancellation insurance
 *   Allows for
 *   # Creation of Policies
 *   # Making Insurance Claims
 *   # Payout of Insurance Claims 
 * @author Dominic Leon Hackett
 */

 import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
 import "@uma/core/contracts/optimistic-oracle-v3/interfaces/OptimisticOracleV3Interface.sol";
import "@uma/core/contracts/optimistic-oracle-v3/implementation/ClaimData.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";


contract FlightInsurance  {

        using SafeERC20 for IERC20;

   struct Policy {
       address owner;
       address insured;
       uint256 premium;
       uint256 coverage;
       uint256 dateCreated;
       uint256 datePurchased;
       bytes insuredEvent;
       bytes32 assertionId;
       State status;
       bool isValue;
   }

   enum State {Created,Active,Claimed,Expired,Canceled}

   event PolicyDeleted(address owner,uint256 dateDeleted);
   event PolicyCreated(address owner,uint256 premium,uint256 coverage,uint256 dateCreated, State status,uint256 id);
   event PolicyPurcahsed(address owner,address insured,uint256 premium,uint256 coverage,uint256 datePurchased, State status,uint256 id);
   event ClaimPaid(address owner,address insured,uint256 premium,uint256 coverage,uint256 datePaid, State status);
   event  IssuerPaid(address owner,address insured,uint256 premium,uint256 coverage,uint256 datePaid, State status);
   event AssertionMade(address sender,bytes32 assertionId,uint256 bond,uint256 dateMade);
    address USDC_ADDRESS;
    IERC20 internal usdcToken; 
   Policy[] policies;
   OptimisticOracleV3Interface public immutable oo;
   bytes32 public immutable defaultIdentifier;
   mapping (bytes32=> uint256) assertionIds;
   uint64 public disputePeriod = 18000;
   uint256 public bond = 10000000;
   address owner;

   /**
   * @dev Modifier isPolicy. 
   * 
   **/	  
	  
    modifier isPolicy (uint256 policyId){
	  require(policies[policyId].isValue == true, "Not a valud policy.");
  	  
   _; 
 }


 /**
   * @dev Modifier isPolicyOwner. 
   * 
   **/	  
	  
    modifier isPolicyOwner (uint256 policyId){
	  require(policies[policyId].isValue == true, "Not a valud policy.");
  	 require(policies[policyId].owner == msg.sender, "Unauthorized can't delete policy.");
  	   
   _; 
 }


/**
   * @dev Modifier isPolicyOwnerOrInsured. 
   * 
   **/	  
	  
    modifier isPolicyOwnerOrInsured (uint256 policyId){
	  require(policies[policyId].isValue == true, "Not a valud policy.");
  	 require(policies[policyId].owner == msg.sender || policies[policyId].insured == msg.sender  , "Unauthorized can't reedem policy.");
  	   
   _; 
 }

 /**
   * @dev Modifier isNotPolicyNOwner. 
   * 
   **/	  
	  
    modifier isNotPolicyOwner (uint256 policyId){
	  require(policies[policyId].isValue == true, "Not a valud policy.");
  	 require(policies[policyId].owner != msg.sender, "You are the policy issuer.");
  	   
   _; 
 }


      constructor (address usdc,address _optimisticOracleV3)  {
       owner = msg.sender;
        USDC_ADDRESS = usdc; 
        usdcToken = IERC20(USDC_ADDRESS);
        oo = OptimisticOracleV3Interface(_optimisticOracleV3);
        defaultIdentifier = oo.defaultIdentifier();

        
      

    }

   /**
   * @dev Function createPolicy 
   * 
   **/
   function createPolicy(uint256 coverage,uint256 premium) public  {
     require(coverage > 0,"Coverage must be greater than zero");
     require(premium > 0,"Premium must be greater than zero");
     require(usdcToken.balanceOf(msg.sender) >= coverage ,"Not enough balance.");
      usdcToken.safeTransferFrom(msg.sender,address(this), coverage);

     policies.push(Policy(msg.sender,address(0),premium,coverage,block.timestamp,0,"",bytes32(0),State.Created,true));

     emit PolicyCreated(msg.sender,premium,coverage,block.timestamp, State.Created,policies.length-1);
     
   }


    /**
   * @dev Function deletePolicy 
   * 
   **/
   function deletePolicy(uint256 policyId) public isPolicyOwner(policyId) {
     require(policies[policyId].status == State.Created,"Policy cannot be deleted.");
     usdcToken.safeTransfer(msg.sender, policies[policyId].coverage);

      emit PolicyDeleted(msg.sender,block.timestamp);
     
   }


    /**
   * @dev Function purchasePolicy 
   * 
   **/
   function purchasePolicy(uint256 policyId, bytes memory insuredEvent) public isNotPolicyOwner(policyId)  {
        require(policies[policyId].status == State.Created,"Policy cannot be purchased.");
        usdcToken.safeTransferFrom(msg.sender,address(this), policies[policyId].premium);
        policies[policyId].datePurchased = block.timestamp;
        policies[policyId].insured = msg.sender;
        policies[policyId].insuredEvent = insuredEvent;
        policies[policyId].status = State.Active; 
        
        emit PolicyPurcahsed(policies[policyId].owner,msg.sender,policies[policyId].premium,policies[policyId].coverage,block.timestamp, State.Active,policyId);

     
   }

    /**
   * @dev Function reedemPolicy 
   * 
   **/
   function reedemPolicy(uint256 policyId) public isPolicyOwnerOrInsured(policyId) returns (bytes32 assertionId) {
      require(policies[policyId].status == State.Active,"Policy cannot be reedemed.");
      require(policies[policyId].assertionId == bytes32(0),"Request to reedem already made.");
      
        usdcToken.safeTransferFrom(msg.sender, address(this), bond);
        usdcToken.safeApprove(address(oo), bond);
        assertionId = oo.assertTruth(
            abi.encodePacked(
                "Flight ",
                policies[policyId].insuredEvent,
                " was canceled or experienced delays of up to 2 hours as of: ",
                ClaimData.toUtf8BytesUint(block.timestamp),
                "  and this policy's pruchase date: ",
              ClaimData.toUtf8BytesUint(policies[policyId].datePurchased),
              " is at least 24 hours before the scheduled departure date."
                
            ),
            msg.sender,
            address(this),
            address(0), // No sovereign security.
            disputePeriod,
            IERC20(USDC_ADDRESS),
            bond,
            defaultIdentifier,
            bytes32(0) // No domain.
        );
        policies[policyId].assertionId = assertionId;
        assertionIds[assertionId] = policyId;

           emit AssertionMade(msg.sender,  assertionId, bond,block.timestamp);


   }


   
    /**
   * @dev Function settlePolicy 
   * 
   **/
   function settlePolicy(uint256 policyId) public  {
      require(policies[policyId].assertionId != bytes32(0),"Policy not processed.");

       
         oo.settleAssertion(  policies[policyId].assertionId);
   }    
       
 

   /**
   * @dev Function assertionResolvedCallback 
   * 
   **/
    function assertionResolvedCallback(bytes32 assertionId, bool assertedTruthfully) public {
        require(msg.sender == address(oo));
        
        if (assertedTruthfully) {
            payPolicyClaim(assertionId);
        }else
          payIssuer(assertionId);
    }

 /**
   * @dev Function payPolicyClaim 
   * Pays the coverage amount to the insured if the insured event occurred
   **/
function payPolicyClaim(bytes32 assertionId) internal {
   uint256 policyId = assertionIds[assertionId];
   
   usdcToken.safeTransfer(policies[policyId].insured,policies[policyId].coverage);
   policies[policyId].status = State.Claimed;
   emit ClaimPaid( policies[policyId].owner,policies[policyId].insured,policies[policyId].premium,policies[policyId].coverage,block.timestamp, State.Claimed);
   
}

 /**
   * @dev Function payIssuer 
   * Pays the coverage amount and premium  to the issuer if the insured event didn't occurred
   **/
function payIssuer(bytes32 assertionId) internal {
   uint256 policyId = assertionIds[assertionId];
   
   usdcToken.safeTransfer(policies[policyId].owner,policies[policyId].coverage+policies[policyId].premium);
   policies[policyId].status = State.Expired;
   emit IssuerPaid( policies[policyId].owner,policies[policyId].insured,policies[policyId].premium,policies[policyId].coverage,block.timestamp, State.Claimed);
   
}

/**
   * @dev Function setDisputePeriod
   * Sets the dispute period in seconds to be used by OO 
**/
  function setDisputePeriod(uint64 period) public {
    require(owner == msg.sender,"Unauthorized you are not the owner.");
    disputePeriod = period;  
  }



/**
   * @dev Function setBond
   * Sets the minimum bond 
**/
  function setBond(uint256 _bond) public {
    require(owner == msg.sender,"Unauthorized you are not the owner.");
    bond = _bond;  
  }


/**
   * @dev Function withdraw
   * Withdraw all funds 
**/
  function withdraw() public {
    require(owner == msg.sender,"Unauthorized you are not the owner.");
    usdcToken.safeTransfer(msg.sender,usdcToken.balanceOf(address(this)));
  }

}