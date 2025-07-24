import Map "mo:base/HashMap";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Option "mo:base/Option";
import Principal "mo:base/Principal";

actor UniIdent {
    // Credential and UserProfile types
    public type Credential = {
        id: Text;
        category: Text; // e.g., "Education", "Work", "Social"
        label: Text;    // e.g., "GitHub"
        value: Text;    // e.g., "https://github.com/aashi"
    };

    public type UserProfile = {
        credentials: [Credential];
    };

    // Storage
    private stable var userProfileEntries : [(Principal, UserProfile)] = [];
    private var userProfiles = Map.fromIter<Principal, UserProfile>(userProfileEntries.vals(), 10, Principal.equal, Principal.hash);

    // System functions for upgrade persistence
    system func preupgrade() {
        userProfileEntries := Map.toArray(userProfiles);
    };
    system func postupgrade() {
        userProfileEntries := [];
    };

    // Helper: get or create empty profile for caller
    private func getOrCreateProfile(caller: Principal) : UserProfile {
        switch (userProfiles.get(caller)) {
            case null { { credentials = [] } };
            case (?profile) { profile };
        }
    }

    // Add a credential
    public shared(msg) func addCredential(cred: Credential) : async Bool {
        let caller = msg.caller;
        var profile = getOrCreateProfile(caller);
        // Prevent duplicate IDs
        if (Array.find<Credential>(profile.credentials, func(c) { c.id == cred.id }) != null) {
            return false;
        };
        let updatedCreds = Array.append<Credential>(profile.credentials, [cred]);
        userProfiles.put(caller, { credentials = updatedCreds });
        true
    };

    // Edit a credential (by id)
    public shared(msg) func editCredential(cred: Credential) : async Bool {
        let caller = msg.caller;
        var profile = getOrCreateProfile(caller);
        let idxOpt = Array.indexOf<Credential>(profile.credentials, func(c) { c.id == cred.id });
        switch (idxOpt) {
            case null { return false; };
            case (?idx) {
                let updatedCreds = Array.tabulate<Credential>(profile.credentials.size(), func(i) {
                    if (i == idx) { cred } else { profile.credentials[i] }
                });
                userProfiles.put(caller, { credentials = updatedCreds });
                true
            }
        }
    };

    // Delete a credential (by id)
    public shared(msg) func deleteCredential(id: Text) : async Bool {
        let caller = msg.caller;
        var profile = getOrCreateProfile(caller);
        let filtered = Array.filter<Credential>(profile.credentials, func(c) { c.id != id });
        if (filtered.size() == profile.credentials.size()) {
            return false; // Not found
        };
        userProfiles.put(caller, { credentials = filtered });
        true
    };

    // Get all credentials for the current user
    public shared query(msg) func getMyProfile() : async UserProfile {
        let caller = msg.caller;
        getOrCreateProfile(caller)
    };

    // Autofill API: return relevant credentials for a form type
    public shared query(msg) func getAutofillTemplate(formType: Text) : async [Credential] {
        let caller = msg.caller;
        let profile = getOrCreateProfile(caller);
        let lowerType = Text.toLowercase(formType);
        // Hardcoded mapping for MVP
        if (Text.contains(lowerType, #text "internship") or Text.contains(lowerType, #text "job")) {
            Array.filter<Credential>(profile.credentials, func(c) {
                c.category == "Education" or c.category == "Work" or c.label == "GitHub" or c.label == "LinkedIn"
            })
        } else if (Text.contains(lowerType, #text "college") or Text.contains(lowerType, #text "scholarship")) {
            Array.filter<Credential>(profile.credentials, func(c) {
                c.category == "Education" or c.label == "Email" or c.label == "Phone"
            })
        } else {
            profile.credentials
        }
    };

    // Health check
    public query func greet(name : Text) : async Text {
        "Hello, " # name # "! Welcome to UniIdent on ICP!"
    };
}