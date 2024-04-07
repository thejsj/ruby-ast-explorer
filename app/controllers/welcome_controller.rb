class WelcomeController < ApplicationController
  def index
    # if session[:user_id] == nil
      # redirect_to '/auth/github'
    # end
    session[:gist_id] = nil
    @transform = %{# Your Transform Class should always extend from
# Parser:: TreeRewriter
class Transform < Parser::TreeRewriter
  def on_lvasgn(node)
    # Reverse the variable names
    replace(node.loc.name, node.children[0].to_s.reverse)
  end

  def on_def(node)
    replace(node.loc.name, node.children[0].to_s.reverse)
  end

  def on_arg(node)
  end

  def on_argument(node)
  end

  def on_back_ref(node)
  end

  def on_blockarg(node)
  end

  def on_casgn(node)
  end

  def on_const(node)
  end

  def on_cvar(node)
  end

  def on_cvasgn(node)
  end

  def on_defs(node)
  end

  def on_empty_else(node)
  end

  def on_forward_arg(node)
  end

  def on_gvar(node)
  end

  def on_gvasgn(node)
  end

  def on_ivar(node)
  end

  def on_ivasgn(node)
  end

  def on_kwarg(node)
  end

  def on_kwoptarg(node)
  end

  def on_kwrestarg(node)
  end

  def on_lvar(node)
  end

  def on_lvasgn(node)
  end

  def on_match_var(node)
  end

  def on_nth_ref(node)
  end

  def on_numblock(node)
  end

  def on_op_asgn(node)
  end

  def on_optarg(node)
  end

  def on_procarg0(node)
  end

  def on_restarg(node)
  end

  def on_send(node)
  end

  def on_shadowarg(node)
  end

  def on_var(node)
  end

  def on_vasgn(node)
  end

  def process_argument_node(node)
  end

  def process_regular_node(node)
  end

  def process_var_asgn_node(node)
  end

  def process_variable_node
  end
end}

  @source_code = %q(a = 1

if was_sent
  if show_first_time_billing_trust_disclaimer
    PlanProperties.set_first_billing_trust_disclaimer_sent(team)
    PlanProperties.set_first_billing_trust_disclaimer_sent(team.plan_parent)
  end
end)
  end
end
