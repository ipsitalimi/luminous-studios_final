import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import ContactLib "../lib/contact";
import Types "../types/contact";

mixin (
  accessControlState : AccessControl.AccessControlState,
  enquiries : Map.Map<Nat, Types.Enquiry>,
  state : { var nextEnquiryId : Nat },
) {
  /// Submit a contact-form enquiry. Open to any caller (including anonymous
  /// visitors). Persists the enquiry and attempts a notification email; the
  /// result distinguishes success from failure.
  public shared ({ caller }) func submitEnquiry(input : Types.EnquiryInput) : async Types.SubmitResult {
    ignore caller;
    await ContactLib.submitEnquiry(enquiries, state, input);
  };

  /// List all stored enquiries. Admin-only.
  public query ({ caller }) func listEnquiries() : async [Types.Enquiry] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can view enquiries");
    };
    ContactLib.listEnquiries(enquiries);
  };
};
