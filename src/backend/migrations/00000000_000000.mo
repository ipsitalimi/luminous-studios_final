import Map "mo:core/Map";
import AccessControl "mo:caffeineai-authorization/access-control";

module {
  type Enquiry = {
    id : Nat;
    name : Text;
    email : Text;
    projectType : Text;
    description : Text;
    budget : ?Text;
    submittedAt : Nat;
  };

  public type OldActor = {};

  public type NewActor = {
    accessControlState : AccessControl.AccessControlState;
    enquiries : Map.Map<Nat, Enquiry>;
    state : { var nextEnquiryId : Nat };
  };

  public func migration(_ : OldActor) : NewActor {
    {
      accessControlState = AccessControl.initState();
      enquiries = Map.empty();
      state = { var nextEnquiryId = 0 };
    };
  };
};
