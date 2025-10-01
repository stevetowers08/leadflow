# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e3]:
    - generic [ref=e5]:
      - img [ref=e7]
      - generic [ref=e9]: EMPOWR
    - generic [ref=e12]:
      - heading "Log in" [level=1] [ref=e14]
      - generic [ref=e15]:
        - button "Continue with Google" [ref=e16] [cursor=pointer]:
          - img
          - text: Continue with Google
        - button "Continue with Facebook" [active] [ref=e17] [cursor=pointer]:
          - img
          - text: Continue with Facebook
        - button "Continue with GitHub" [ref=e18] [cursor=pointer]:
          - img
          - text: Continue with GitHub
      - generic [ref=e23]: or
      - generic [ref=e24]:
        - generic [ref=e25]:
          - generic [ref=e26]: Email address
          - textbox "Email address" [ref=e27]
        - generic [ref=e28]:
          - generic [ref=e29]: Password
          - generic [ref=e30]:
            - textbox "Password" [ref=e31]
            - button [ref=e32] [cursor=pointer]:
              - img [ref=e33] [cursor=pointer]
        - button "Forgot password?" [ref=e37] [cursor=pointer]
        - button "Log in" [ref=e38] [cursor=pointer]
      - generic [ref=e39]:
        - button "Can't Access Your Account?" [ref=e40] [cursor=pointer]
        - generic [ref=e41]:
          - text: Don't have an account?
          - button "Sign Up" [ref=e42] [cursor=pointer]
  - region "Notifications alt+T"
```