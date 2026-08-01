# Vital Cost Laboratory - patch 26.15

## Product question

The laboratory must answer one narrow question well:

> If Fiora spends Q to proc this visible Vital now, what does the lane charge back before she reaches a useful second position?

It must not output a fake win probability or flatten the answer into "take / do not take". The useful output is a cost ledger: what Fiora gains, what she pays, what remains uncertain, and which state change flips the read.

## Evidence model

### Exact geometry

- Fiora Q range and enemy carry attack range come from Riot Data Dragon 16.15.1.
- Champion identity and basic spell range strings come from the same patch snapshot.
- Board coordinates are a consistent tactical projection. They preserve relative game-unit ranges but do not reproduce Summoner's Rift collision geometry.

### Composite estimates

- Allied support influence uses the largest usable basic-spell range as a readable coverage envelope.
- Enemy support threat uses the same method as an answer envelope.
- These envelopes show whether an actor can influence the endpoint. They do not claim the spell will hit, that the angle is legal through minions, or that the player will cast it correctly.

### Player-supplied hidden state

- Key control ready or spent.
- Carry escape or spacing spell ready or spent.
- Carry committed to an animation or still free to move.
- Fiora Riposte ready or spent.
- Jungle position known or unknown.
- Near lane bush owned or unowned.
- Fiora HP threshold.

Those inputs remain explicit because replay and timeline data cannot reliably recover intent, exact cooldown knowledge, brush ownership at each second, or the reason a Vital was declined.

## Cost ledger

Every read crosses the same systems:

1. **Q access** - can the selected Vital be reached without advertising an extra step or spending Flash?
2. **Allied cover** - can the allied support fix, damage, or protect the Q endpoint during the first enemy answer?
3. **Enemy answer queue** - which support spell owns the endpoint, and is Riposte available for it?
4. **Carry second position** - can the carry retreat, displace Fiora, or keep attacking after Q is spent?
5. **Wave tax** - does minion aggro reward the enemy counter-chunk or punish their retaliation?
6. **Exit route** - does Fiora leave through an owned bush, allied body, open lane, or prepared support zone?
7. **Information** - is the decision priced as a visible 2v2 or can a third body arrive during the extension?
8. **HP threshold** - can Fiora pay one ordinary return cycle without losing the next all-in?

The verdict is a summary of those factors, never a substitute for them.

## Verdict vocabulary

- **No Contact** - Q geometry is not legal yet.
- **Free Vital** - the first proc has cover and no important immediate cost.
- **Trade Starter** - the proc can flow into a supported second action.
- **Conditional** - one named state or execution detail decides the price.
- **Paid Vital** - the passive proc does not repay the current counter-chunk.
- **Riposte-Locked** - ready enemy control owns the endpoint while W is unavailable.
- **Trap Vital** - several costs stack on the same Q.

## Construction stages

### Stage 1 - playable foundation

- Draft-aware champion selectors.
- Four draggable actors.
- Four Vital faces.
- Wave, HP, cooldown, commitment, bush and jungle controls.
- Range overlays and entry/exit paths.
- Transparent factor ledger and flip conditions.
- Analysis and prediction modes.
- Three teaching scenarios plus saved Home draft import.

### Stage 2 - spell-shape geometry

- Replace generic support circles with line, cone, dash, displacement and target-lock shapes.
- Add minion collision to hook and projectile lanes.
- Add carry-specific escape destinations rather than a single readiness flag.
- Separate "can reach" from "can legally reach through this wave".

### Stage 3 - contact timeline

- Scrubbable 0-3 second sequence.
- Q endpoint, allied fixing spell, enemy first answer, Riposte allocation and exit action on separate beats.
- Compare two sequences without declaring one universally correct.
- Show when the original price expires because a cooldown or position changes.

### Stage 4 - scenario bank

- Curated level-1, level-2, crash, bounce, freeze, gank and post-reset situations.
- Carry-support intersections rather than isolated champion cards.
- Counterexamples where the same front Vital changes price after only one variable moves.
- Patch review stamp on every scenario family.

### Stage 5 - replay reconstruction

- Manual frame capture or imported clip markers.
- Rebuild actor positions and selected spell states from a real play.
- Compare the player's prediction with the ledger.
- Keep inferred states visibly marked instead of presenting them as telemetry.

## Performance constraints

- Load the laboratory only when its guide page opens.
- Recalculate on drag and control changes only; no animation frame game loop.
- Use CSS/SVG overlays and existing Data Dragon icons.
- Keep the board responsive and provide button nudging for keyboard and touch precision.
- Respect reduced-motion preferences.

## Patch sources

- Riot patch 26.15 notes: https://www.leagueoflegends.com/en-us/news/game-updates/league-of-legends-patch-26-15-notes/
- Riot Data Dragon 16.15.1 champion data: https://ddragon.leagueoflegends.com/cdn/16.15.1/data/en_US/championFull.json

