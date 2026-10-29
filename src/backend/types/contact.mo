module {
  /// A stored contact-form enquiry.
  public type Enquiry = {
    id : Nat;
    name : Text;
    email : Text;
    projectType : Text;
    description : Text;
    budget : ?Text;
    submittedAt : Nat;
  };

  /// The fields a visitor submits. `budget` is optional.
  public type EnquiryInput = {
    name : Text;
    email : Text;
    projectType : Text;
    description : Text;
    budget : ?Text;
  };

  /// Why an enquiry submission failed. The frontend branches on the tag so it
  /// never reports a false success.
  public type EnquiryError = {
    #invalidInput : Text;
    #notificationFailed : Text;
  };

  /// Submission outcome: `#ok` carries the stored enquiry id; `#err` carries a
  /// typed reason. A message is only reported as sent on `#ok`.
  public type SubmitResult = {
    #ok : Nat;
    #err : EnquiryError;
  };
};
