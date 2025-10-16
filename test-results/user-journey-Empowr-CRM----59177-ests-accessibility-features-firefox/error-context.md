# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e3]:
    - generic [ref=e5]:
      - img [ref=e7]
      - generic [ref=e9]: EMPOWR
    - generic [ref=e12]:
      - generic [ref=e13]:
        - heading "Welcome back" [level=1] [ref=e14]
        - paragraph [ref=e15]: Sign in to your professional dashboard
      - button "Continue with Google" [ref=e17] [cursor=pointer]:
        - img
        - text: Continue with Google
      - generic [ref=e22]: or
      - generic [ref=e23]:
        - generic [ref=e24]:
          - text: Email address
          - textbox "Email address" [active] [ref=e25]:
            - /placeholder: Enter your email
        - generic [ref=e26]:
          - text: Password
          - generic [ref=e27]:
            - textbox "Password" [ref=e28]:
              - /placeholder: Enter your password
            - button [ref=e29] [cursor=pointer]:
              - img [ref=e30]
        - button "Forgot password?" [ref=e34] [cursor=pointer]
        - button "Log in" [ref=e35] [cursor=pointer]
      - generic [ref=e36]:
        - button "Can't Access Your Account?" [ref=e37] [cursor=pointer]
        - generic [ref=e38]:
          - text: Don't have an account?
          - button "Sign Up" [ref=e39] [cursor=pointer]
  - region "Notifications alt+T"
```