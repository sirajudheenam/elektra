$:.push File.expand_path("../lib", __FILE__)
Gem::Specification.new do |spec|
  spec.name = "cronus"
  spec.version = "0.0.1"
  spec.authors = ["Elektra UI team"]
  spec.summary = "An Elektra plugin"
  spec.license = "MIT"
  spec.files = Dir["{app,config,db,lib}/**/*", "MIT-LICENSE", "Rakefile", "README.md"]
end
