param(
  [string]$ModelPath = "C:\tts\voices\en_GB-alba-medium.onnx",
  [string]$ConfigPath = "C:\tts\voices\en_GB-alba-medium.onnx.json",
  [string]$OutputDir = "C:\Users\Lotfi\OneDrive\Bureau\clip guide LoL\fira adc\Fiora-adc-git\public\voices"
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path $ModelPath)) {
  throw "Model not found: $ModelPath"
}

if (-not (Test-Path $ConfigPath)) {
  throw "Config not found: $ConfigPath"
}

New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null

$entries = @(
  @{
    File = "home.wav"
    Text = "Welcome to the Fiora ADC lab. This is for players who want an actual lane plan, a carry mindset, and a support who understands what the lane needs before minions even meet."
  },
  @{
    File = "why-fiora-adc-works.wav"
    Text = "Fiora ADC works because she punishes bad spacing, panicked reactions, and bot lanes that do not realize how fast one bad step can turn into a full commit."
  },
  @{
    File = "runes.wav"
    Text = "Runes decide how lane starts before the first trade even happens. PTA is for short brutal windows and direct punishment. Phase Rush is for access, resets, and getting out without donating the trade back."
  },
  @{
    File = "build.wav"
    Text = "The build is not random. Start with Tiamat and Ravenous Hydra, then ask whether the game wants burst, balance, or a less greedy answer to enemy damage."
  },
  @{
    File = "skill-order.wav"
    Text = "Your early levels decide whether lane is fake pressure or real pressure. Q gives access, E gives the burst window, and W lets you stop pretending the enemy controls the trade."
  },
  @{
    File = "matchups.wav"
    Text = "Treat matchups as trends, not prison sentences. A bad lane becomes playable the second Fiora gets first lead, better tempo, or one engage that actually lands cleanly."
  },
  @{
    File = "lane-phase.wav"
    Text = "Lane phase is patience plus violence. Keep your health, own the brush, respect the spikes, then go all the way in when the opening is finally real."
  },
  @{
    File = "fioras-support.wav"
    Text = "Support sync is mandatory. Fiora wants target access, cover on entry, and someone who understands the difference between a real go button and random enthusiasm."
  },
  @{
    File = "mid-late-game.wav"
    Text = "After lane, pick one job and commit to it. Split, flank, pick, or group, but stop drifting between ideas and bleeding pressure for free."
  },
  @{
    File = "mechanical-tips.wav"
    Text = "Good Fiora mechanics are not just fast fingers. They are calm timing, correct angles, and knowing exactly when the lane wants patience instead of ego."
  },
  @{
    File = "videos-clips.wav"
    Text = "Use clips to study decisions, spacing, entry timing, and reset windows. If a clip only shows the kill, it is hiding the part that actually mattered."
  }
)

$tempDir = Join-Path $PSScriptRoot ".tts-temp"
New-Item -ItemType Directory -Force -Path $tempDir | Out-Null

try {
  foreach ($entry in $entries) {
    $tempTextPath = Join-Path $tempDir ($entry.File + ".txt")
    $outputPath = Join-Path $OutputDir $entry.File

    Set-Content -Path $tempTextPath -Value $entry.Text -NoNewline

    Get-Content $tempTextPath | py -m piper --model $ModelPath --config $ConfigPath --output_file $outputPath
  }
}
finally {
  if (Test-Path $tempDir) {
    Remove-Item $tempDir -Recurse -Force
  }
}
