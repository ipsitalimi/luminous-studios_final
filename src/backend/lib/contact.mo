import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Time "mo:core/Time";
import EmailClient "mo:caffeineai-email/emailClient";
import Types "../types/contact";

module {
  /// The placeholder recipient for enquiry notification emails. Replace with
  /// the owner's real business address to enable email delivery.
  public let notificationRecipient : Text = "REPLACE_WITH_BUSINESS_EMAIL";

  /// Trim leading/trailing whitespace and collapse the result to a value that
  /// is safe to test for emptiness.
  func trimmed(value : Text) : Text {
    value.trim(#predicate(func c = c == ' ' or c == '\t' or c == '\n' or c == '\r'));
  };

  /// Validate the visitor's input. Returns `null` when valid, otherwise a
  /// human-readable reason for the first failing field.
  func validate(input : Types.EnquiryInput) : ?Text {
    if (trimmed(input.name).size() == 0) {
      return ?"Please enter your name.";
    };
    let email = trimmed(input.email);
    if (email.size() == 0) {
      return ?"Please enter your email address.";
    };
    if (not (email.contains(#char '@') and email.contains(#char '.'))) {
      return ?"Please enter a valid email address.";
    };
    if (trimmed(input.projectType).size() == 0) {
      return ?"Please choose a project type.";
    };
    if (trimmed(input.description).size() == 0) {
      return ?"Please tell us a little about your project.";
    };
    null;
  };

  /// Persist a new enquiry and attempt a notification email to the placeholder
  /// recipient. Returns `#ok(id)` only when the enquiry is stored and the
  /// notification succeeds; otherwise `#err(reason)`.
  public func submitEnquiry(
    enquiries : Map.Map<Nat, Types.Enquiry>,
    state : { var nextEnquiryId : Nat },
    input : Types.EnquiryInput,
  ) : async Types.SubmitResult {
    switch (validate(input)) {
      case (?reason) { return #err(#invalidInput(reason)) };
      case null {};
    };

    let id = state.nextEnquiryId;
    let enquiry : Types.Enquiry = {
      id;
      name = trimmed(input.name);
      email = trimmed(input.email);
      projectType = trimmed(input.projectType);
      description = trimmed(input.description);
      budget = input.budget;
      submittedAt = Time.now().toNat();
    };

    let subject = "New enquiry from " # enquiry.name;
    let body = "<p><strong>Name:</strong> " # enquiry.name # "</p>"
      # "<p><strong>Email:</strong> " # enquiry.email # "</p>"
      # "<p><strong>Project type:</strong> " # enquiry.projectType # "</p>"
      # "<p><strong>Budget:</strong> " # (enquiry.budget ?? "Not specified") # "</p>"
      # "<p><strong>Description:</strong></p><p>" # enquiry.description # "</p>";

    let result = await EmailClient.sendServiceEmail(
      "no-reply",
      [notificationRecipient],
      subject,
      body,
    );

    switch (result) {
      case (#ok) {
        enquiries.add(id, enquiry);
        state.nextEnquiryId := id + 1;
        #ok(id);
      };
      case (#err(error)) { #err(#notificationFailed(error)) };
    };
  };

  /// List every stored enquiry, newest first. Admin-only at the API layer.
  public func listEnquiries(enquiries : Map.Map<Nat, Types.Enquiry>) : [Types.Enquiry] {
    let all = enquiries.values().toArray();
    all.sort(func(a, b) = Nat.compare(b.id, a.id));
  };
};
