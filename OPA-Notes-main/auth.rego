package auth

allow if{
    input.user.role == "admin"
}

# Manager → read/write reports
allow if{
    input.user.role == "manager"
    input.resource == "reports"
    input.action == "read"
}

allow if{
    input.user.role == "manager"
    input.resource == "reports"
    input.action == "write"
}

# User → read their own profile
allow if{
    input.user.role == "user"
    input.resource == "profile"
    input.action == "read"
    input.user.id == input.resource_owner_id
}
