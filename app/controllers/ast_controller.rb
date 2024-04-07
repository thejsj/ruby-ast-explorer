# frozen_string_literal: true
require 'stringio'
require 'parser/current'
require 'json'


def capture_stdout
  original_stdout = $stdout  # Save the original stdout

  unless block_given?
    raise StandardError.new("No block provided.")
  end

  $stdout = StringIO.new     # Redirect stdout to a StringIO object

  yield                       # Execute the block of code that outputs to stdout

  $stdout.string              # Return the contents of stdout
ensure
  $stdout = original_stdout  # Restore the original stdout
end

# AST Controller
class AstController < ApplicationController
  def index
    @ast = Parser::CurrentRuby.parse('2 + 2')
    p @ast
    respond_to do |format|
      format.json { render json: { ast: @ast } }
    end
  end

  def create
    @source_code = params[:code]
    @transform = params[:transform]

    ast = Parser::CurrentRuby.parse(params[:code])

    # Doing eval is not that safe, need to sanitize
    eval(params[:transform])

    buffer        = Parser::Source::Buffer.new('(example)')
    buffer.source = params[:code]
    temp = Parser::CurrentRuby.parse(params[:code])
    rewriter = Transform.new

    output = ""

    captured_stdout_output = capture_stdout do
      # Rewrite the AST, returns a String with the new form.
      output = rewriter.rewrite(buffer, temp)
    end

    respond_to do |format|
      format.json { render json: { ast: ast.to_s, output: output.to_s, treeData: ast.to_json, captured_stdout_output: captured_stdout_output } }
    end
  end
end
