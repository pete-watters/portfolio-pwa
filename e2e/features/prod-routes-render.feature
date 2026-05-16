Feature: Prod routes render guardrail

  Visual regression guardrail covering every prod route on petewatters.ie.
  Each scenario asserts the page renders without any pageerror (catches
  total-app crashes) and snapshots the rendered DOM.

  This suite assumes the four open feature PRs (#67 homepage, #68 case
  studies, #69 CV collapse, #70 NFT avatar) have landed on dev. If running
  against a dev that doesn't have them yet, expect failures on /work/*
  and the unified /cv/ scenarios — those routes only exist post-merge.

  Scenario: Home renders
    When I visit "/"
    Then no page error should have occurred
    And the rendered page matches the snapshot "home"

  Scenario: Blog index renders
    When I visit "/blog"
    Then no page error should have occurred
    And the rendered page matches the snapshot "blog-index"

  Scenario: A blog post renders
    When I visit "/blog/xapo-nextjs-verify-flow/"
    Then no page error should have occurred
    And the rendered page matches the snapshot "blog-post-xapo-nextjs-verify-flow"

  Scenario: CV renders
    When I visit "/cv/"
    Then no page error should have occurred
    And the rendered page matches the snapshot "cv"

  Scenario: Old CV variant URL redirects to /cv/
    When I visit "/cv/full-stack"
    Then no page error should have occurred
    And the rendered page matches the snapshot "cv"

  Scenario: Leather case study renders
    When I visit "/work/leather/"
    Then no page error should have occurred
    And the rendered page matches the snapshot "work-leather"

  Scenario: Cryptowatch case study renders
    When I visit "/work/cryptowatch/"
    Then no page error should have occurred
    And the rendered page matches the snapshot "work-cryptowatch"

  Scenario: Xapo case study renders
    When I visit "/work/xapo/"
    Then no page error should have occurred
    And the rendered page matches the snapshot "work-xapo"

  Scenario: Qredo case study renders
    When I visit "/work/qredo/"
    Then no page error should have occurred
    And the rendered page matches the snapshot "work-qredo"

  Scenario: 404 page renders for an unknown route
    When I visit "/this-route-does-not-exist"
    Then no page error should have occurred
    And the rendered page matches the snapshot "404"
