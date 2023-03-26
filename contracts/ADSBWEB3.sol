// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;
/**
 * @title ADSBWEB3 Contract
 * @dev Contract to manager ADSBWEB3 Subscriptions and Carbon Tracker
 *   Allows for
 *   # Subscribing to ADSBWEB3
 *   # Carbon Tracker for flights
 * @author Dominic Leon Hackett
 */

 import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ADSBWEB3 is Ownable {


struct carbonTracker {
    address owner;
    string distance;
    string  flight;
    string train;
    string bus;
    string car;
    uint256 date;
    bool isValue;
}    

struct subscriptionPlan {
      string name;
      uint256 fee;
      bool isValue;
}    

struct subscription {
        
        address subscriber;
        uint256 subscriptionDate;
       uint256 plan;
        bool isValue;
    }

    mapping (address =>subscription) subscriptions;
    uint256 subscriptionBalance;
    carbonTracker[] tracker;
    subscriptionPlan[] plans;
    //uint256 subscriptionFee;
      address USDC_ADDRESS;
    IERC20 internal usdcToken; 
    event Subscribed(address subscriber,uint256 plan,uint256 fee,uint256 subscriptionDate);
    event CarbonTracker(address owner, string distance, string flight,string train,string bus,string car,uint256 date);

     constructor (address usdc)  {
        USDC_ADDRESS = usdc; 
        usdcToken = IERC20(USDC_ADDRESS);
        
        //Setup plans
        plans.push(subscriptionPlan("Basic",0,true));
        plans.push(subscriptionPlan("Essential",29,true));
        plans.push(subscriptionPlan("Premium",59,true));
      

    }

	    


/**
   * @dev Modifier isPlan. 
   * 
   **/	  
	  
    modifier isPlan (uint256 plan){
	  require(plans[plan].isValue == true, "Not a valud plan.");
  	  
   _; 
 }

    /**
   * @dev Modifier isSubscribed. 
   * 
   **/	  
	  
    modifier isSubscribed (){
	  require(subscriptions[msg.sender].isValue == true, "You are not subscribed.");
  	  require(block.timestamp -subscriptions[msg.sender].subscriptionDate <= (86400*365), "You are not subscribed"); // 1 year Subscription

   _; 
 }

/**
   * @dev Modifier notSubscribed. 
   * 
   **/
   modifier notSubscribed (){
      if(subscriptions[msg.sender].isValue == true)
	  require(block.timestamp -subscriptions[msg.sender].subscriptionDate > (86400*365), "You are subscribed"); //30 Day Subscription

   _; 
 }
/* @dev Function subscribed  
   * 
   **/
    function subscribed() public view returns (bool) 
    {
        if(subscriptions[msg.sender].isValue == true && block.timestamp -subscriptions[msg.sender].subscriptionDate <= (86400*365))
          return true;

        return false;  
    }

    /**
   * @dev Function subscribe  
   * 
   **/
    function subscribe(uint256 plan) public notSubscribed() isPlan(plan) 
    {
        uint256 senderBalanceRequired = plans[plan].fee*10**6;
        require(usdcToken.balanceOf(msg.sender) >= senderBalanceRequired, "Not enough balance");
        if(senderBalanceRequired != 0)
        usdcToken.transferFrom(msg.sender,address(this), senderBalanceRequired);
        subscriptions[msg.sender].isValue = true;
        subscriptions[msg.sender].subscriber = msg.sender;
        subscriptions[msg.sender].subscriptionDate = block.timestamp;
        subscriptions[msg.sender].plan = plan;
        subscriptionBalance += senderBalanceRequired;
        emit Subscribed(msg.sender,plan,plans[plan].fee,block.timestamp);


    }

    /**
   * @dev Function set subscription Fee 
   * 
   * 
   **/
    function setSubcriptionFee(uint256 plan,uint256 fee) public onlyOwner isPlan(plan)
    {
        
        plans[plan].fee = fee;
       
    } 


     /**
   * @dev Function get subscription Fee 
   * 
   * 
   **/
    function getSubcriptionFee(uint256 plan) public isPlan(plan) view returns(uint256) 
    {
        return(plans[plan].fee) ;
    
    } 


      /**
   * @dev Function trackCarbonEmissons  
   * 
   **/
    function trackCarbonEmissons(string calldata distance,string calldata flight ,string calldata train,string calldata bus,string calldata car,uint256 date) public isSubscribed()  
    {
       tracker.push(carbonTracker(msg.sender,distance,flight,train,bus,car,date,true)) ;
       emit CarbonTracker(msg.sender, distance, flight, train,bus, car, date);

    }

}