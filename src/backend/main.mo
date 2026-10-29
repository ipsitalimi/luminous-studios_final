import Map "mo:core/Map";
import Nat "mo:core/Nat";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import Expose "mo:caffeineai-oql/Expose";
import Entity "mo:caffeineai-oql/Entity";
import MapEntity "mo:caffeineai-oql/MapEntity";
import RecordValue "mo:caffeineai-oql/RecordValue";
import NatValue "mo:caffeineai-oql/NatValue";
import TextValue "mo:caffeineai-oql/TextValue";
import ContactApiMixin "mixins/contact-api";
import ApiDocMixin "mixins/api-doc";
import Types "types/contact";

actor {
  let accessControlState : AccessControl.AccessControlState;
  include MixinAuthorization(accessControlState, null);

  let enquiries : Map.Map<Nat, Types.Enquiry>;
  let state : { var nextEnquiryId : Nat };

  include ContactApiMixin(accessControlState, enquiries, state);
  include ApiDocMixin();

  include Expose({
    entities = [
      enquiries.toEntity("enquiry", "Enquiry", "id")
        .sample({
          id = 0;
          name = "";
          email = "";
          projectType = "";
          description = "";
          budget = ?"";
          submittedAt = 0;
        })
        .controllerOnly()
        .build(),
    ];
  });
};
