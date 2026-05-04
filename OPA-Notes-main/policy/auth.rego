package auth

default allow = false

allow if input.user.role == "admin"

allow if {
    input.user.role == "manager"
    input.resource == "reports"
    input.action in ["read", "write"]
}

allow if {
    input.user.role == "user"
    input.resource == "profile"
    input.action == "read"
    input.user.id == input.resource_owner_id
}
