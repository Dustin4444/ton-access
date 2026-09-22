---
title: Validator status list
name: validator-status-list
description: Validator status list
metadata: {}
---

# Validator status list

Status epochs, for reference:

```plaintext
activation_eligibility_epoch: Epoch  # When criteria for activation were met
activation_epoch: Epoch              # When the validator is/was scheduled to activate. May change while in the activation queue.
exit_epoch: Epoch                    # When the validator is/was scheduled to exit. May change while exiting.
withdrawable_epoch: Epoch            # When validator can withdraw funds
```

Statuses:

- `pending`

  - Condition: `validator.activation_epoch > current_epoch`
  - Sub statuses:
    - `pending_initialized` - When the first deposit is processed, but not enough funds are available (or not yet the end of the first epoch) to get into the activation queue.
      - Condition: `validator.activation_eligibility_epoch == FAR_FUTURE_EPOCH`
    - `pending_queued` - When you are waiting to get activated, and have enough funds etc. while in the queue, your activation epoch keeps changing until you get to the front and make it through (finalization is a requirement here too)
      - Condition: `(validator.activation_eligibility_epoch < FAR_FUTURE_EPOCH) and (validator.activation_epoch > current_epoch)`

- `active`:

  - Condition: `validator.activation_epoch <= current_epoch < validator.exit_epoch`
  - Sub statuses:
    - `active_ongoing` - When you must be attesting, and have not initiated any exit.
      - Condition: `(validator.activation_epoch <= current_epoch) and (validator.exit_epoch == FAR_FUTURE_EPOCH)`
    - `active_exiting` - When you are still active, but filed a voluntary request to exit.
      - Condition: `(validator.activation_epoch <= current_epoch) and (current_epoch < validator.exit_epoch < FAR_FUTURE_EPOCH) and (not validator.slashed)`
    - `active_slashed` - When you are still active, but have a slashed status, and are scheduled to exit.
      - Condition: `(validator.activation_epoch <= current_epoch) and (current_epoch < validator.exit_epoch < FAR_FUTURE_EPOCH) and validator.slashed`

- `exited`:

  - Condition: `(validator.exit_epoch <= current_epoch < validator.withdrawable_epoch)`
  - Sub statuses:
    - `exited_unslashed` - When you reach your reguler exit epoch, not being slashed, and you don't have to attest any more, but cannot withdraw yet.
      - Condition: `(validator.exit_epoch <= current_epoch < validator.withdrawable_epoch) and (not validator.slashed)`
    - `exited_slashed` - When you reach your exit epoch, but were slashed, have to wait for a longer withdrawal period, and still will lose stake based on the 50% backward and forward context rule.
      - Condition: `(validator.exit_epoch <= current_epoch < validator.withdrawable_epoch) and validator.slashed`

- `withdrawal`:

  - Condition: `validator.withdrawable_epoch <= current_epoch`
  - Sub statuses:
    - `withdrawal_possible` - after having exited, a while later you are permitted to move funds, and are truly out of the system
      - Condition: `(validator.withdrawable_epoch <= current_epoch) and (balance != 0)`
    - `withdrawal_done` (not possible in phase0, except slashing full balance) - actually having moved funds away
      - Condition: `(validator.withdrawable_epoch <= current_epoch) and (balance == 0)`