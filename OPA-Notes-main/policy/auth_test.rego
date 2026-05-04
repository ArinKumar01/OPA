package auth

test_allow_admin {
    allow with input as {"user": {"role": "admin"}}
}

test_allow_manager_reports_read {
    allow with input as {
        "user": {"role": "manager"},
        "resource": "reports",
        "action": "read"
    }
}

test_deny_user_wrong_profile {
    not allow with input as {
        "user": {"role": "user", "id": "alice"},
        "resource": "profile",
        "action": "read",
        "resource_owner_id": "bob"
    }
}

test_allow_user_own_profile {
    allow with input as {
        "user": {"role": "user", "id": "alice"},
        "resource": "profile",
        "action": "read",
        "resource_owner_id": "alice"
    }
}
